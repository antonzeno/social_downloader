import * as React from 'react';
import { useState } from 'react';


const Header = () => {
    return (
        <div className="header-container d-flex flex-column align-items-center justify-content-center">
            <h2>Download videos from Youtube</h2>
            <p>Paste the URL below and press download</p>
        </div>
    );
}

export default Header;