
import PropTypes from "prop-types";
import "./MenuBar.css";

function MenuBar({ onUpload, onDownload }) {
    return (
        <div className='menu-bar'>
        <button onClick={onUpload}>Upload</button>
        <button onClick={onDownload} className='menu-button'>Download</button>
        </div>
    );
}

MenuBar.propTypes = {
    onUpload: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired,
};

export default MenuBar;