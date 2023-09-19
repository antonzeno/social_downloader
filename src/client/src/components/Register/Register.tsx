import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { Form, FormControl, Button, FormLabel } from 'react-bootstrap';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { CircularProgress } from '@mui/joy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';


function Register() {

    const USERNAME_REGEX = /^[A-Za-z0-9_]{6,}$/;
    const PWD_REGEX = /^[A-Za-z0-9_]{8,}$/;
    const EMAIL_REGEX = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

    const [validUsername, setValidUsername] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validPassword2, setValidPassword2] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [success, setSuccess] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const successRef = useRef(success);
    const errMsgRef = useRef(errMsg);

    useEffect(() => {
        setValidUsername(USERNAME_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        setValidPassword2(!isEmpty(password) && !isEmpty(password2) && password === password2);
    }, [password, password2]);

    useEffect(() => {
        // Update the ref values to match the current state values
        successRef.current = success;
        errMsgRef.current = errMsg;

        // Handle scenario: success changes to true
        if (successRef.current) {
            setErrMsg('');
        }

        // Cleanup function
        return () => {
            // Handle scenario: errMsg changes from empty to something else
            if (errMsgRef.current !== '' && errMsg !== '' && successRef.current) {
                setSuccess(false);
            }
        };
    }, [errMsg, success]);



    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validUsername) {
            alert('Username must be at least 6 characters.')
            return;
        }

        if (!validPassword2) {
            alert('Passwords do not match.')
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await axios.post('http://localhost:8001/auth/register', {
                email,
                password,
                username,
            });

            if (response.status == 200) {
                setUsername("");
                setEmail("");
                setPassword("");
                setPassword2("");
                setErrMsg('');
                setSuccess(true);

            }

        } catch (err: any) {
            if (!err.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.status === 409) {
                setErrMsg("Username Taken");
            } else {
                setErrMsg("Registration Failed");
            }
            setSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Form className="container register-form d-flex flex-column align-items-center p-4 rounded border border-gray bg-white" onSubmit={handleSubmit}>
                <h1>Register</h1>
                <Form.Group className="w-100 me-md-2">
                    <FormLabel>Username <FontAwesomeIcon icon={faCheck} className={validUsername ? "d-inline" : "d-none"} />
                    </FormLabel>
                    <FormControl
                        type="text"
                        name="username"
                        className="w-100"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <FormLabel>Email <FontAwesomeIcon icon={faCheck} className={validEmail ? "d-inline" : "d-none"} /></FormLabel>
                    <FormControl
                        type="email"
                        name="email"
                        className="w-100"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FormLabel>Password <FontAwesomeIcon icon={faCheck} className={validPassword ? "d-inline" : "d-none"} /> </FormLabel>
                    <FormControl
                        type="password"
                        name="password"
                        className="w-100"
                        disabled={isSubmitting}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <FormLabel>Confirm Password <FontAwesomeIcon icon={validPassword2 ? faCheck : faTimes} className={!isEmpty(password2) ? "d-inline" : "d-none"} /> </FormLabel>
                    <FormControl
                        type="password"
                        name="password2"
                        className="w-100"
                        disabled={isSubmitting}
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className='mt-2' disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size="sm" /> : 'Register'}
                </Button>
                {success && <div className='text-success'>Registration successful.</div>}
                {!isEmpty(errMsg) && <div className='text-danger'>{errMsg}</div>}
            </Form>
        </div>
    );

};

export default Register;
