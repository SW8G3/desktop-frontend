import React from "react";
import "./MenuBar.css";

function MenuBar({ onUpload, onDownload }) {
    return (
        <div className="menu-bar">
        <button onClick={onUpload}>Upload</button>
        <button onClick={onDownload} className="menu-button">Download</button>
        </div>
    );
}

export default MenuBar;