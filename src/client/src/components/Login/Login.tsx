import React, { useState, FormEvent, useContext } from 'react';
import { Form, FormControl, Button, FormLabel } from 'react-bootstrap';
import { CircularProgress } from '@mui/joy';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function Login() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const navigate = useNavigate();

    const { login } = useContext(AuthContext)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('http://localhost:8001/auth/login', {
                email,
                password,
            });

            if (response.status == 200) {
                setSuccess(true);
                const expiryDuration = 60 * 60 * 1000;
                const expiryDate = new Date(Date.now() + expiryDuration);
                const formattedExpiryDate = expiryDate.toUTCString();
                document.cookie = `token=${response.data.token}; path=/; expires=${formattedExpiryDate}; Secure; SameSite=None`;
                login();
                navigate('/');
            }

        } catch (err: any) {
            if (!err.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.status === 400) {
                setErrMsg("Login Failed");
            }
            setSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            {success ? <div className='text-success mt-2'>Login Successful</div> :
                <Form className="container login-form d-flex flex-column align-items-center p-4 rounded border border-gray bg-white" onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <Form.Group className="w-100 me-md-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl
                            type="text"
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
                        {isSubmitting ? <CircularProgress size="sm" /> : 'Login'}
                    </Button>
                    {!isEmpty(errMsg) && <div className='text-danger mt-2'>{errMsg}</div>}
                </Form>
            }

        </div>
    );
}

export default Login;
