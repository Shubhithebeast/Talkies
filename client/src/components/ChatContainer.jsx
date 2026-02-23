import React,{useState,useEffect,useRef} from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from "styled-components";
import Logout from './Logout';
import ChatInput from './ChatInput';
import axios from  'axios';
import { getAllMessagesRoute, sendMessageRoute, clearChatRoute } from '../utils/APIRoutes';
import {v4 as uuidv4 } from "uuid";
import { useTheme } from '../context/ThemeContext';

const ChatContainer = ({currentChat, currentUser, socket}) => {
    const { theme } = useTheme();
    const [messages, setMessages] = useState([]);
    const [arrivalMessage,setArrivalMessage] =useState(null);
    const scrollRef = useRef();

    useEffect(()=>{
        if(currentChat && currentUser._id){
            async function fetchData(){
                const response = await axios.post(getAllMessagesRoute,{
                    from:currentUser._id,
                    to:currentChat._id,
                })
                setMessages(response.data);
            }
            fetchData();
        }
    },[currentChat]);


    const handleSendMsg = async (msg)=>{
        
        await axios.post(sendMessageRoute, {
            to:currentChat._id,
            from: currentUser._id,
            message:msg
        })  
        
        if(socket.current && socket.current.connected){
            console.log("Emitting send-msg:", {to: currentChat._id, from: currentUser._id, message: msg});
            socket.current.emit("send-msg",{
                to:currentChat._id,
                from: currentUser._id,
                message:msg,
            });
        } else {
            console.error("Socket not connected!");
        }

        const msgs = [...messages];
        msgs.push({fromSelf:true, message:msg});
        // console.log("msgs: ",msgs);
        setMessages(msgs);
        // console.log("send-msg: ",msg);

    }


    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-receive", (data) => {
                console.log("msg-receive:", data, "currentChat:", currentChat?._id);
                // Only add message if it's from the currently open chat
                if (currentChat && data.from === currentChat._id) {
                    setArrivalMessage({ fromSelf: false, message: data.message });
                }
            });
        }
        
        return () => {
            if (socket.current) {
                socket.current.off("msg-receive");
            }
        };
    }, [currentChat]);


    useEffect(()=>{
        arrivalMessage && setMessages((prev) => [...prev,arrivalMessage]);
        // console.log("Arrival.msg...",arrivalMessage);
    },[arrivalMessage])

    useEffect(()=>{
        scrollRef.current?.scrollIntoView({ behavior:"smooth"});
    },[messages]);

    const handleClearChat = async () => {
        if (window.confirm('Are you sure you want to clear this chat? This cannot be undone.')) {
            try {
                await axios.post(clearChatRoute, {
                    from: currentUser._id,
                    to: currentChat._id,
                });
                setMessages([]);
                toast.success('Chat cleared successfully!');
            } catch (error) {
                toast.error('Failed to clear chat');
            }
        }
    };

    return (
        currentChat && (
            <Container theme={theme}>
                    <div className="chat-header">
                        <div className='user-details'>
                            <div className='avatar'>
                                <img
                                    src={currentChat.avatarImage?.startsWith('data:image') 
                                        ? currentChat.avatarImage 
                                        : `data:image/svg+xml;base64,${currentChat.avatarImage}`}
                                    alt="avatar"
                                    onError={(e) => {
                                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiM3YzNhZWQiLz48dGV4dCB4PSIzMiIgeT0iMzgiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIj4/PC90ZXh0Pjwvc3ZnPg==";
                                    }}
                                />
                            </div>
                            <div className='username'>
                                <h3>{currentChat.username}</h3>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button className="clear-chat-btn" onClick={handleClearChat} title="Clear chat">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                            <Logout />
                        </div>
                    </div>

                    <div className="chat-messages">
                        {messages.map((message) => {
                            return (
                                <div ref={scrollRef} key={uuidv4()}>
                                    <div className={`message ${message.fromSelf ? "sended" : "received"}`} >
                                        <div className='content'>
                                            <p>{message.message}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <ChatInput handleSendMsg={handleSendMsg} />
                    <ToastContainer />
                </Container>
            )
    )
}

const Container = styled.div`
    height: 100%;
    display:grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    overflow:hidden;
    background-color: ${props => props.theme.chatBg};

    .chat-header{
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:0.85rem 1.4rem;
        background-color: ${props => props.theme.containerBg};
        border-bottom: 1px solid ${props => props.theme.border};

        .user-details{
            display:flex;
            align-items:center;
            gap:1rem;
            .avatar{
                img{
                    height:3rem;
                    border-radius:50%;
                }
            }
            .username{
                h3{
                    color: ${props => props.theme.text};
                    font-weight: 600;
                    letter-spacing: 0.01em;
                }
            }
        }
        
        .header-actions {
            display: flex;
            align-items: center;
            gap: 1rem;
            
            .clear-chat-btn {
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
                }
                
                svg {
                    stroke-width: 2;
                }
            }
        }
    }

    .chat-messages{
        min-height: 0;
        padding: 1rem 1.4rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
        background-color: ${props => props.theme.chatBg};
        
        &::-webkit-scrollbar {
            width:0.4rem;
            &-thumb{
                background-color: ${props => props.theme.primary};
                width:0.2rem;
                border-radius:1rem;
            }
        }

        .message{
            display:flex;
            align-items:center;
            .content{
                max-width:60%;
                overflow-wrap:break-word;
                padding:0.8rem 1.2rem;
                font-size:1rem;
                border-radius:1rem;
                line-height:1.5;
                box-shadow: 0 2px 4px ${props => props.theme.shadow};
                border: 1px solid ${props => props.theme.border};
            }
        }
        .sended{
            justify-content:flex-end;
            .content{
                background-color: ${props => props.theme.messageSent};
                color: ${props => props.theme.messageSentText};
                border-bottom-right-radius: 0.25rem;
            }
        }
        .received{
            justify-content:flex-start;
            .content{
                background-color: ${props => props.theme.messageReceived};
                color: ${props => props.theme.messageReceivedText};
                border-bottom-left-radius: 0.25rem;
            }
        }
    }
`

export default ChatContainer
