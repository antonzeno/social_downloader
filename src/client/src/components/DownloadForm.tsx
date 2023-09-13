import React, { useState } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';
import axios from 'axios';


const banner = require('../assets/images/banner.png');


function DownloadForm() {

    const [url, setUrl] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios({
                method: 'post',
                url: 'http://localhost:8001/api/youtube',
                data: {
                    url: url,
                },
                responseType: 'blob', // responseType to 'blob' to receive binary data
            });

            console.log(response.headers);


            if (response.status === 200) {
                // Create a blob from the response data
                const blob = new Blob([response.data], { type: 'application/octet-stream' });
                const filename = getFilenameFromContentDisposition(response.headers['content-disposition']);
                const url = window.URL.createObjectURL(blob);

                // Create a temporary <a> element to trigger the download
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();

                // Clean up
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                console.error('Failed to download:', response.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getFilenameFromContentDisposition = (contentDisposition: any) => {
        const matches = contentDisposition.match(/filename="(.+)"$/);
        return matches ? matches[1] : null;
    };

    return (
        <div className="d-flex flex-column align-items-center">
            <img src={banner} alt="Banner" className="my-3" />

            <Form className="d-flex flex-md-row flex-column align-items-center p-4 rounded border border-gray bg-white" style={{ width: '80%' }} onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail" className="w-100 me-2">
                    <FormControl
                        type="text"
                        name="url"
                        placeholder="https://"
                        className="w-100"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Download
                </Button>
            </Form>
        </div>
    );
}

export default DownloadForm;
