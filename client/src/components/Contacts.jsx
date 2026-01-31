
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Logo from "../assets/logo.svg";
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

// Default avatar SVG (DiceBear style, base64-encoded)
const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiM0ZTBlZmYiLz48dGV4dCB4PSIzMiIgeT0iMzgiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIj8+PzwvdGV4dD48L3N2Zz4=";

const getAvatarSrc = (avatarImage) => {
    if (!avatarImage || avatarImage.trim() === "") return DEFAULT_AVATAR;
    if (avatarImage.startsWith("data:image")) return avatarImage;
    return `data:image/svg+xml;base64,${avatarImage}`;
};

const Contacts = ({contacts,currentUser, changeChat}) => {
    const { theme } = useTheme();
    const [currentUserName,setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);

    useEffect(()=>{
        // console.log("contacts:",contacts) 
        if(currentUser){
            setCurrentUserName(currentUser.username);
            setCurrentUserImage(currentUser.avatarImage);
        }
    },[currentUser]); 

    const changeCurrentChat = (index,contact)=> {
        setCurrentSelected(index);
        changeChat(contact);  
    };


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
                    {
                        contacts.map((contact,index)=>{
                            return(
                                <div key={index}
                                className={`contact 
                                    ${index===currentSelected ? "selected" : ""}`}
                                    onClick={() => changeCurrentChat(index,contact)}
                                >
                                    <div className='avatar'>
                                                                                <img 
                                                                                    src={getAvatarSrc(contact.avatarImage)}
                                                                                    alt="avatar"
                                                                                 />
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
            </Container>
        )}
    </>
  )
}


const Container = styled.div`
    display:grid;
    grid-template-rows: 10% 75% 15%;
    overflow:hidden;
    background-color: ${props => props.theme.containerBg};
    border-right: 1px solid ${props => props.theme.border};
    
    .brand{
        display:flex;
        align-items:center;
        justify-content:space-between;
        padding: 0 1rem;
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
            font-weight: 600;
        }
    }

    .contacts{
        display:flex;
        flex-direction:column;
        align-items:center;
        overflow:auto;
        gap:0.8rem;
        padding: 1rem 0;
        
        &::-webkit-scrollbar{
            width:0.3rem;
            &-thumb{
                background-color: ${props => props.theme.primary};
                width:0.1rem;
                border-radius:1rem;
            }
        }
        
        .contact{
            background-color: ${props => props.theme.hover};
            min-height:5rem;
            cursor:pointer;
            width:90%;
            border-radius:0.5rem;
            padding:0.8rem;
            display:flex;
            gap:1rem;
            align-items:center;
            transition:0.3s ease-in-out;
            border: 1px solid transparent;
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px ${props => props.theme.shadow};
            }
            
            .avatar{
                img{
                    height:3rem;
                    border-radius:50%;
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
            background-color: ${props => props.theme.primary};
            border-color: ${props => props.theme.primaryLight};
            
            .username h3 {
                color: white;
            }
        }
    }
    
    .current-user{
        background-color: ${props => props.theme.chatBg};
        display:flex;
        justify-content:center;
        align-items:center;
        gap:2rem;
        border-top: 1px solid ${props => props.theme.border};
        
        .avatar{
            img{
                height:4rem;
                max-inline-size:100%;
                border-radius:50%;
            }
        }

        .username{
            h2{
                color: ${props => props.theme.text};
                font-size:1.2rem;
            }
        }

        @media screen and (min-width:720px) and (max-width:1080px){
            gap: 0.5rem;
            .username{
                h2{
                font-size:1.5rem;
            }
        }

`;

export default Contacts