
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/logo.svg";
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import Logout from './Logout';

// Default avatar SVG (DiceBear style, base64-encoded)
const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiM0ZTBlZmYiLz48dGV4dCB4PSIzMiIgeT0iMzgiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIj8+PzwvdGV4dD48L3N2Zz4=";

const getAvatarSrc = (avatarImage) => {
    if (!avatarImage || avatarImage.trim() === "") return DEFAULT_AVATAR;
    if (avatarImage.startsWith("data:image")) return avatarImage;
    return `data:image/svg+xml;base64,${avatarImage}`;
};

const Contacts = ({contacts,currentUser, changeChat, onlineUsers = []}) => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [currentUserName,setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelectedId, setCurrentSelectedId] = useState(undefined);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(()=>{
        // console.log("contacts:",contacts) 
        if(currentUser){
            setCurrentUserName(currentUser.username);
            setCurrentUserImage(currentUser.avatarImage);
        }
    },[currentUser]); 

    const changeCurrentChat = (contact)=> {
        setCurrentSelectedId(contact._id);
        changeChat(contact);  
    };

    const filteredContacts = contacts.filter((contact) =>
        contact.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
        {currentUserName && currentUserImage && (
            <Container theme={theme}>
                <div className='brand'>
                    <div className='logo-title'>
                        <img src={Logo} alt="Logo" />
                        <h3>Talkies</h3>
                    </div>
                    <ThemeToggle />
                </div>
                <div className='contacts'>
                    <div className="search">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {
                        filteredContacts.map((contact,index)=>{
                            const isOnline = onlineUsers.includes(contact._id);
                            return(
                                <div
                                    key={contact._id || index}
                                    className={`contact ${contact._id===currentSelectedId ? "selected" : ""}`}
                                    onClick={() => changeCurrentChat(contact)}
                                >
                                    <div className='avatar'>
                                        <img 
                                            src={getAvatarSrc(contact.avatarImage)}
                                            alt="avatar"
                                         />
                                        {isOnline && <span className="online-dot" title="Online"></span>}
                                    </div>
                                    <div className='username'>
                                        <h3>{contact.username}</h3>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="current-user">
                    <div className="user-info">
                        <div className="avatar">
                            <img 
                                src={getAvatarSrc(currentUserImage)}
                                alt="avatar"
                            />
                        </div>
                        <div className="username">
                            <h2>{currentUserName}</h2>
                        </div>
                    </div>
                    <div className="user-actions">
                        <Logout />
                    <button className="settings-btn" onClick={() => navigate('/profile')} title="Profile Settings">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                    </div>
                </div>
            </Container>
        )}
    </>
  )
}


const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: ${props => props.theme.containerBg};
    border-right: 1px solid ${props => props.theme.border};
    
    .brand{
        display:flex;
        align-items:center;
        justify-content:space-between;
        padding: 1rem;
        flex-shrink: 0;
        border-bottom: 1px solid ${props => props.theme.border};
        
        .logo-title {
            display:flex;
            align-items:center;
            gap:1rem;
        }
        
        img{
            height:2rem;
        }
        h3{
            color: ${props => props.theme.text};
            text-transform:uppercase;
            font-weight: 700;
            letter-spacing: 0.04em;
        }
    }

    .contacts{
        display:flex;
        flex-direction:column;
        align-items:center;
        flex: 1;
        overflow-y:auto;
        overflow-x:hidden;
        gap:0.8rem;
        padding: 1rem 0.5rem 0.5rem 0.5rem;

        .search{
            width: 90%;
            margin-bottom: 0.2rem;

            input{
                width:100%;
                border:1px solid ${props => props.theme.border};
                border-radius:0.65rem;
                padding:0.55rem 0.8rem;
                background: ${props => props.theme.chatBg};
                color: ${props => props.theme.text};
                font-size:0.95rem;
                outline:none;
            }
        }
        
        &::-webkit-scrollbar{
            width:0.4rem;
            &-thumb{
                background-color: ${props => props.theme.primary};
                border-radius:1rem;
            }
        }
        
        .contact{
            background-color: ${props => props.theme.hover};
            min-height:4rem;
            cursor:pointer;
            width:90%;
            border-radius:0.5rem;
            padding:0.6rem 0.8rem;
            display:flex;
            gap:1rem;
            align-items:center;
            transition:0.3s ease-in-out;
            border: 1px solid ${props => props.theme.border};
            
            &:hover {
                transform: translateY(-1px);
                box-shadow: 0 6px 14px ${props => props.theme.shadow};
            }
            
            .avatar{
                position: relative;
                img{
                    height:3rem;
                    border-radius:50%;
                }

                .online-dot{
                    position:absolute;
                    right: -0.1rem;
                    bottom: -0.05rem;
                    width: 0.7rem;
                    height: 0.7rem;
                    border-radius:50%;
                    background:#22c55e;
                    border:2px solid ${props => props.theme.containerBg};
                    box-shadow: 0 0 0 2px rgba(34,197,94,0.2);
                }
            }
            .username{
                h3{
                    color: ${props => props.theme.text};
                    font-size:1rem;
                }
            }

        }
        .selected{
            background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.primaryLight});
            border-color: ${props => props.theme.primaryLight};
            
            .username h3 {
                color: white;
            }
        }
    }
    
    .current-user{
        background-color: ${props => props.theme.chatBg};
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:1.5rem;
        padding: 0.8rem;
        flex-shrink: 0;
        border-top: 1px solid ${props => props.theme.border};
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .avatar{
            img{
                height:3.5rem;
                max-inline-size:100%;
                border-radius:50%;
            }
        }

        .username{
            h2{
                color: ${props => props.theme.text};
                font-size:1.1rem;
            }
        }
        
        .settings-btn {
            background: transparent;
            border: 1px solid ${props => props.theme.border};
            color: ${props => props.theme.textSecondary};
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 0.3s;
            
            &:hover {
                background: ${props => props.theme.hover};
                color: ${props => props.theme.primary};
                transform: rotate(90deg);
            }
            
            svg {
                stroke-width: 1.5;
            }
        }

        .user-actions{
            display:flex;
            align-items:center;
            gap:0.6rem;
        }

        @media screen and (min-width:720px) and (max-width:1080px){
            gap: 0.5rem;

            .username{
                h2{
                    font-size:1rem;
                }
            }
        }
    }

`;

export default Contacts
