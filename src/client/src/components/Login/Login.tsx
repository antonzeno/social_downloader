import React, { useState, FormEvent } from 'react';
import { Form, FormControl, Button, FormLabel } from 'react-bootstrap';
import { CircularProgress } from '@mui/joy';

function Login() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('submitted');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Form className="container login-form d-flex flex-column align-items-center p-4 rounded border border-gray bg-white" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <Form.Group className="w-100 me-md-2">
                    <FormLabel>Username</FormLabel>
                    <FormControl
                        type="text"
                        name="username"
                        className="w-100"
                        disabled={isSubmitting}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <FormLabel>Password</FormLabel>
                    <FormControl
                        type="password"
                        name="password"
                        className="w-100"
                        disabled={isSubmitting}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className='mt-2' disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size="sm" /> : 'Login'}
                </Button>
            </Form>
        </div>
    );
}

export default Login;
