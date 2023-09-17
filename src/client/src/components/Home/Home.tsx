import React from 'react';

import Header from './Header';
import DownloadForm from './DownloadForm';

const Home = () => {
    return (
        <div className="container">
            <Header />
            <DownloadForm />
        </div>
    );
}

export default Home;