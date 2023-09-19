import React, { useContext } from 'react';
import { Card } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';


const Profile = () => {
    const { username } = useContext(AuthContext)
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Card className="p-4">
                <h1>Hello {username} </h1>
                <p className="text-center">This is your profile page.</p>
            </Card>
        </div>
    );
}

export default Profile;