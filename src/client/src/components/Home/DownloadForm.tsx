import React, { useContext, useEffect, useState } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';
import axios from 'axios';
import CircularProgress from '@mui/joy/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { isEmpty } from 'lodash';

import MediaDownloader from './MediaDownloader';
import { AuthContext } from '../../context/AuthContext';


function DownloadForm() {

    const [url, setUrl] = useState<string>('');
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('Downloading');
    const [dots, setDots] = useState<string>('');
    const [downloadReady, setDownloadReady] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [fileURL, setFileURL] = useState('');
    const { isAuthenticated } = useContext(AuthContext);
    const maxDownloadCount = isAuthenticated ? 999999 : 1;
    const [downloadCount, setDownloadCount] = useState(() => {
        const storedDownloadCount = localStorage.getItem('downloadCount');
        return storedDownloadCount !== null ? parseInt(storedDownloadCount, 10) : 0;
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isEmpty(url)) {
            showSnackbar('URL cannot be empty.');
            return;
        }

        setDownloadCount(downloadCount + 1);
        localStorage.setItem('downloadCount', (downloadCount + 1).toString());

        if (maxDownloadCount < downloadCount) {
            alert('You reached max number of downloads. Please login to download more.');
            return;
        }

        setIsDownloading(true);
        setDownloadReady(false);
        const dotInterval = setInterval(() => {
            setDots(prevDots => prevDots.length >= 3 ? '' : prevDots + '.');
        }, 1000);

        const messages = ['Downloading', 'Hang tight', 'Almost there'];

        let messageIndex = -1; // Start with -1 to show the first message on the initial update
        setMessage(messages[messageIndex]);

        const updateMessage = () => {
            if (messageIndex < messages.length) {
                messageIndex++;
                setMessage(messages[messageIndex]);
                setDots('');
                setTimeout(updateMessage, 4000);
            } else {
                setTimeout(updateMessage, 1000);
            }
        };

        updateMessage();

        try {
            const response = await axios({
                method: 'post',
                url: 'http://localhost:8001/api/youtube',
                data: {
                    url: url,
                },
            });

            if (response.status === 200) {
                setFileURL(response.headers['content-disposition']);
                setDownloadReady(true);
            } else {
                showSnackbar('Failed to download. Please check your URL.');
                console.error('Failed to download:', response.data);
            }

            setIsDownloading(false);
            clearInterval(dotInterval);

        } catch (error) {
            console.error('Error:', error);
            showSnackbar('We could not process your request. Please check the URL.');
            setIsDownloading(false);
            clearInterval(dotInterval);
        }
    };

    const showSnackbar = (message: string) => {
        setOpenSnackbar(true);
        setSnackbarMessage(message);
        setInterval(() => {
            setOpenSnackbar(false)
        }, 4000);
    };

    return (
        <>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Form className="download-form d-flex flex-md-row flex-column align-items-center p-4 rounded shadow-sm bg-white" onSubmit={handleSubmit}>
                <Form.Group className="w-100 me-md-2">
                    <FormControl
                        type="text"
                        name="url"
                        placeholder="https://"
                        className="w-100"
                        disabled={isDownloading}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className='mt-2 mt-md-0' disabled={isDownloading}>
                    {isDownloading ? <CircularProgress size="sm" /> : 'Download'}
                </Button>
            </Form>

            {(isDownloading || downloadReady) && <MediaDownloader isDownloading={isDownloading} downloadReady={downloadReady} message={message} dots={dots} mediaUrl={fileURL} />}
        </>
    );
}

export default DownloadForm;