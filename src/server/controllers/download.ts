import express from 'express';
import youtubeDl from 'youtube-dl-exec';
import fs from 'fs';
import https from 'https';
import http from 'http';
import _ from 'lodash';

import MediaFile from '../models/mediaFile';

const downloadFromUrl = (mediaFile: MediaFile) => {
    const localFilePath = mediaFile.name + '.' + mediaFile.ext;
    const urlObject = new URL(mediaFile.url);
    const downloader = urlObject.protocol === 'https:' ? https : http;

    // Make a GET request to the URL
    downloader.get(mediaFile.url, (response) => {
        if (response.statusCode === 200) {
            const fileStream = fs.createWriteStream(localFilePath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                console.log(`File downloaded to ${localFilePath}`);
            });
        } else {
            console.error(`Failed to download file. Status code: ${response.statusCode}`);
        }
    }).on('error', (err) => {
        console.error('Error downloading file:', err);
    });
}

export const downloadFromYoutube = async (req: express.Request, res: express.Response) => {
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
        // Check if the format contains both video and audio
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
        downloadFromUrl(mediaFile);
        return res.status(200).json('downloaded');
    } else {
        return res.status(400).json('please check url');

    }
}