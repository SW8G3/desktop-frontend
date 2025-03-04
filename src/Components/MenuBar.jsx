import React from "react";
import "./MenuBar.css";

function MenuBar({ onUpload }) {
    return (
        <div className="menu-bar">
        <button onClick={onUpload}>Upload</button>
        <button className="menu-button">Download</button>
        </div>
    );
}

export default MenuBar;