import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import { FaArrowLeft } from 'react-icons/fa'; // Import an icon from react-icons
import { registerUser, loginUser } from './API/AuthAPI';

const LogIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // State to store error messages
    const [msgColor, setMsgColor] = useState(''); // State to store message color
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            navigate('/'); // Redirect to /
        }
    }, [navigate]);

    const registerUserHandler = async (e) => {
        e.preventDefault();
        setMessage('');
        setMsgColor('');
    
        try {
            await registerUser(username, password); // Call the API function
            setMessage('Registration successful! You can now log in.');
            setMsgColor('green');
            setUsername('');
            setPassword('');
        } catch (err) {
            setMessage(err.message);
            setMsgColor('red');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMsgColor('');
    
        try {
            const data = await loginUser(username, password); // Call the API function
            localStorage.setItem('token', data.token); // Store the JWT token
    
            const params = new URLSearchParams(window.location.search);
            const redirectFrom = params.get('redirectFrom') || '/admin';
            navigate(redirectFrom);
        } catch (err) {
            setMessage(err.message);
            setMsgColor('red');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
            {/* Go Back Button */}
            <button
                onClick={() => navigate(-1)} // Navigate to the previous page
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 20px',
                    fontSize: '1rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                }}
            >
                <FaArrowLeft style={{ marginRight: '5px' }} /> Go Back
            </button>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <h2>Log In</h2>
                {message && <p style={{ color: msgColor }}>{message}</p>} {/* Display error message */}
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ marginBottom: '10px', padding: '8px' }}
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ marginBottom: '20px', padding: '8px' }}
                />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '10px' }}>
                    Sign In
                </button>
                <button
                    type="button"
                    onClick={registerUserHandler}
                    style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default LogIn;