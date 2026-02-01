import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { updateProfileRoute } from '../utils/APIRoutes';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [currentUser, setCurrentUser] = useState(undefined);
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('chat-app-user');
        if (!userData) {
            navigate('/login');
        } else {
            const user = JSON.parse(userData);
            setCurrentUser(user);
            setUsername(user.username);
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim()) {
            toast.error('Username cannot be empty');
            return;
        }
        
        setIsLoading(true);
        try {
            const { data } = await axios.post(`${updateProfileRoute}/${currentUser._id}`, {
                username,
            });
            
            if (data.status) {
                localStorage.setItem('chat-app-user', JSON.stringify(data.user));
                toast.success('Profile updated successfully!');
                setTimeout(() => {
                    navigate('/chat');
                }, 1500);
            }
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container theme={theme}>
            <FormContainer theme={theme}>
                <h1>Update Profile</h1>
                <form onSubmit={handleSubmit}>
                    <div className="avatar-display">
                        <img
                            src={currentUser?.avatarImage?.startsWith('data:image')
                                ? currentUser.avatarImage
                                : `data:image/svg+xml;base64,${currentUser?.avatarImage}`}
                            alt="avatar"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Profile'}
                    </button>
                    <button type="button" onClick={() => navigate('/chat')} className="cancel">
                        Cancel
                    </button>
                </form>
            </FormContainer>
            <ToastContainer />
        </Container>
    );
};

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.background};
`;

const FormContainer = styled.div`
    background-color: ${props => props.theme.containerBg};
    padding: 3rem;
    border-radius: 1rem;
    box-shadow: 0 8px 32px ${props => props.theme.shadow};
    
    h1 {
        color: ${props => props.theme.text};
        margin-bottom: 2rem;
        text-align: center;
    }
    
    form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        
        .avatar-display {
            display: flex;
            justify-content: center;
            margin-bottom: 1rem;
            
            img {
                height: 8rem;
                border-radius: 50%;
                border: 3px solid ${props => props.theme.primary};
            }
        }
        
        input {
            background-color: ${props => props.theme.chatBg};
            color: ${props => props.theme.text};
            padding: 1rem;
            border: 1px solid ${props => props.theme.border};
            border-radius: 0.5rem;
            font-size: 1rem;
            
            &:focus {
                outline: none;
                border-color: ${props => props.theme.primary};
            }
        }
        
        button {
            background-color: ${props => props.theme.primary};
            color: white;
            padding: 1rem;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: 0.3s;
            
            &:hover {
                background-color: ${props => props.theme.primaryLight};
            }
            
            &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            &.cancel {
                background-color: ${props => props.theme.textSecondary};
                
                &:hover {
                    background-color: ${props => props.theme.text};
                }
            }
        }
    }
`;

export default Profile;
