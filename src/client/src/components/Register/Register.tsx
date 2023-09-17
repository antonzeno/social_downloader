import React, { useState, FormEvent } from 'react';
import { Form, FormControl, Button, FormLabel } from 'react-bootstrap';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { CircularProgress } from '@mui/joy';

function Register() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('submitted');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Form className="container register-form d-flex flex-column align-items-center p-4 rounded border border-gray bg-white" onSubmit={handleSubmit}>
                <h1>Register</h1>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl
                        type="email"
                        name="email"
                        className="w-100"
                        disabled={isSubmitting}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    {isSubmitting ? <CircularProgress size="sm" /> : 'Register'}
                </Button>
            </Form>
        </div>
    );
}

export default Register;
