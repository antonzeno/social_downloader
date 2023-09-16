import React from 'react';
import './App.css';

import NavigationBar from "./components/Navbar";
import DownloadForm from './components/DownloadForm';
import Header from './components/Header';

function App() {
  return (
    <>
      <NavigationBar />
      <div className="content-wrapper">
        <Header />
        <DownloadForm />
      </div>

    </>
  );
}

export default App;