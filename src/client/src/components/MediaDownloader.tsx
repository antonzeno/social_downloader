import React, { FunctionComponent } from 'react';
import CircularProgress from '@mui/joy/CircularProgress';
import Button from '@mui/material/Button';
import VideoPlayer from 'react-player';
import axios from 'axios';

interface MediaDownloaderProps {
    downloadReady: boolean;
    isDownloading: boolean;
    message: string;
    dots: string;
    mediaUrl: string;
}

const MediaDownloader: FunctionComponent<MediaDownloaderProps> = ({ isDownloading, downloadReady, message, dots, mediaUrl }) => {

    const handleDownload = async () => {

        try {
            const response = await axios.post('http://localhost:8001/api/download', {
                fileUrl: mediaUrl
            }, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Me at the zoo.mp4';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="text-center d-flex flex-column flex-lg-row justify-content-center align-items-center rounded border border-gray bg-white mt-4 p-4 w-75">


            {
                !isDownloading && downloadReady ?
                    <>
                        <div className="border-gray border rounded me-5">
                            <VideoPlayer
                                controls url={mediaUrl}
                                width="100%"
                                height="100%"
                            />
                        </div>
                        <div className='d-flex flex-row flex-lg-column justify-content-between align-items-center mt-3 mt-lg-0'>
                            <Button variant="contained" className='mb-lg-3' onClick={handleDownload}>Download video</Button>
                            <Button variant="outlined">Share video</Button>
                        </div>
                    </>
                    :
                    <div>
                        <CircularProgress size={'md'} />
                        <h5 className="mt-3">{message}{dots}</h5>
                    </div>
            }

        </div>
    );
}

export default MediaDownloader;
