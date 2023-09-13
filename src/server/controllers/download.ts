import express from 'express';
import youtubeDl from 'youtube-dl-exec';
import fs from 'fs';
import https from 'https';
import http from 'http';
import _ from 'lodash';

import MediaFile from '../models/mediaFile';

const downloadFromUrl = async (mediaFile: MediaFile) => {
    const localFilePath = `src/server/downloads/${mediaFile.name}.${mediaFile.ext}`;
    const urlObject = new URL(mediaFile.url);
    const downloader = urlObject.protocol === 'https:' ? https : http;

    return new Promise<void>((resolve, reject) => {
        const fileStream = fs.createWriteStream(localFilePath);

        downloader.get(mediaFile.url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(fileStream);

                fileStream.on('finish', () => {
                    console.log(`File downloaded to ${localFilePath}`);
                    resolve();
                });
            } else {
                console.error(`Failed to download file. Status code: ${response.statusCode}`);
                reject(new Error('Failed to download file'));
            }
        }).on('error', (err) => {
            console.error('Error downloading file:', err);
            reject(err);
        });
    });
}

export const downloadFromYoutube = async (req: express.Request, res: express.Response) => {
    try {
        const output = await youtubeDl(req.body.url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: [
                'referer:youtube.com',
                'user-agent:googlebot'
            ]
        });

        const mediaFileData = _.maxBy(output.formats, (format) => {
            return (
                format.acodec !== 'none' &&
                format.vcodec !== 'none' &&
                format.quality
            );
        });

        if (mediaFileData) {
            const mediaFile: MediaFile = {
                name: output.title || 'Unknown',
                ext: mediaFileData.ext || 'mp4',
                url: mediaFileData.url,
            };

            await downloadFromUrl(mediaFile);

            const fileName = `${mediaFile.name}.${mediaFile.ext}`;
            res.download(`src/server/downloads/${fileName}`, fileName);

        } else {
            return res.status(400).json({ error: 'Please check the URL' });
        }

    } catch (error) {
        console.error('Error in downloadFromYoutube:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
