import React,{useState,useEffect,useRef} from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from "styled-components";
import ChatInput from './ChatInput';
import axios from  'axios';
import { getAllMessagesRoute, sendMessageRoute, clearChatRoute } from '../utils/APIRoutes';
import {v4 as uuidv4 } from "uuid";
import { useTheme } from '../context/ThemeContext';

const ChatContainer = ({currentChat, currentUser, socket, onlineUsers = []}) => {
    const { theme } = useTheme();
    const [messages, setMessages] = useState([]);
    const [arrivalMessage,setArrivalMessage] =useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const scrollRef = useRef();
    const isCurrentChatOnline = currentChat ? onlineUsers.includes(currentChat._id) : false;

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


    const handleSendMsg = async ({ message, messageType = "text", attachment = null })=>{
        
        await axios.post(sendMessageRoute, {
            to:currentChat._id,
            from: currentUser._id,
            message,
            messageType,
            attachment,
        })  
        
        if(socket.current && socket.current.connected){
            console.log("Emitting send-msg:", {to: currentChat._id, from: currentUser._id, message});
            socket.current.emit("send-msg",{
                to:currentChat._id,
                from: currentUser._id,
                message,
                messageType,
                attachment,
            });
        } else {
            console.error("Socket not connected!");
        }

        const msgs = [...messages];
        msgs.push({fromSelf:true, message, messageType, attachment});
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
                    setArrivalMessage({
                        fromSelf: false,
                        message: data.message,
                        messageType: data.messageType || "text",
                        attachment: data.attachment || null,
                    });
                }
            });

            socket.current.on("typing", (data) => {
                if (currentChat && data.from === currentChat._id) {
                    setIsTyping(true);
                }
            });

            socket.current.on("stop-typing", (data) => {
                if (currentChat && data.from === currentChat._id) {
                    setIsTyping(false);
                }
            });
        }
        
        return () => {
            if (socket.current) {
                socket.current.off("msg-receive");
                socket.current.off("typing");
                socket.current.off("stop-typing");
            }
        };
    }, [currentChat]);


    useEffect(()=>{
        arrivalMessage && setMessages((prev) => [...prev,arrivalMessage]);
        // console.log("Arrival.msg...",arrivalMessage);
    },[arrivalMessage])

    useEffect(() => {
        setIsTyping(false);
    }, [currentChat]);

    const handleTyping = () => {
        if (socket.current && currentChat) {
            socket.current.emit("typing", { from: currentUser._id, to: currentChat._id });
        }
    };

    const handleStopTyping = () => {
        if (socket.current && currentChat) {
            socket.current.emit("stop-typing", { from: currentUser._id, to: currentChat._id });
        }
    };

    useEffect(()=>{
        scrollRef.current?.scrollIntoView({ behavior:"smooth"});
    },[messages]);

    const handleClearChat = async () => {
        try {
            setIsClearing(true);
            await axios.post(clearChatRoute, {
                from: currentUser._id,
                to: currentChat._id,
            });
            setMessages([]);
            setShowClearModal(false);
            toast.success('Chat cleared successfully!');
        } catch (error) {
            toast.error('Failed to clear chat');
        } finally {
            setIsClearing(false);
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
                                <h3>
                                    {currentChat.username}
                                    {isCurrentChatOnline && <span className="online-dot" title="Online"></span>}
                                </h3>
                                {isTyping && <span className="typing-status">typing...</span>}
                            </div>
                        </div>
                        <div className="header-actions">
                            <button className="clear-chat-btn" onClick={() => setShowClearModal(true)} title="Clear chat">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="chat-messages">
                        {messages.map((message) => {
                            const isImage = message.messageType === "file" && message.attachment?.fileType?.startsWith("image/");
                            const isVideo = message.messageType === "file" && message.attachment?.fileType?.startsWith("video/");
                            return (
                                <div ref={scrollRef} key={uuidv4()}>
                                    <div className={`message ${message.fromSelf ? "sended" : "received"}`} >
                                        <div className='content'>
                                            {message.messageType === "file" && message.attachment ? (
                                                <div className="file-message">
                                                    {isImage && <img src={message.attachment.data} alt={message.attachment.fileName || "shared"} />}
                                                    {isVideo && (
                                                        <video controls>
                                                            <source src={message.attachment.data} type={message.attachment.fileType} />
                                                        </video>
                                                    )}
                                                    {!isImage && !isVideo && (
                                                        <a href={message.attachment.data} download={message.attachment.fileName || "file"}>
                                                            {message.attachment.fileName || "Download file"}
                                                        </a>
                                                    )}
                                                    {message.message ? <p>{message.message}</p> : null}
                                                </div>
                                            ) : (
                                                <p>{message.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <ChatInput handleSendMsg={handleSendMsg} onTyping={handleTyping} onStopTyping={handleStopTyping} />
                    {showClearModal && (
                        <div className="confirm-overlay" onClick={() => !isClearing && setShowClearModal(false)}>
                            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                                <h4>Clear chat?</h4>
                                <p>All messages in this conversation will be removed. This action cannot be undone.</p>
                                <div className="confirm-actions">
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => setShowClearModal(false)}
                                        disabled={isClearing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="delete-btn"
                                        onClick={handleClearChat}
                                        disabled={isClearing}
                                    >
                                        {isClearing ? "Clearing..." : "Yes, Clear"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <ToastContainer />
                </Container>
            )
    )
}

const Container = styled.div`
    height: 100%;
    display:grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    position: relative;
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
                    display:flex;
                    align-items:center;
                    gap:0.45rem;
                }

                .online-dot{
                    width: 0.6rem;
                    height: 0.6rem;
                    border-radius:50%;
                    background:#22c55e;
                    box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
                }

                .typing-status{
                    display:block;
                    font-size:0.8rem;
                    margin-top:0.15rem;
                    color:#22c55e;
                    font-style: italic;
                    font-weight: 700;
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

                .file-message{
                    display:flex;
                    flex-direction:column;
                    gap:0.5rem;

                    img, video{
                        max-width: 240px;
                        border-radius: 0.6rem;
                    }

                    a{
                        color: inherit;
                        text-decoration: underline;
                        font-weight: 600;
                    }
                }
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

    .confirm-overlay{
        position:absolute;
        inset:0;
        background: rgba(3, 7, 18, 0.55);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index: 8;
        padding: 1rem;
    }

    .confirm-modal{
        width: min(430px, 100%);
        background: ${props => props.theme.containerBg};
        border:1px solid ${props => props.theme.border};
        border-radius: 0.9rem;
        box-shadow: 0 20px 40px ${props => props.theme.shadow};
        padding: 1rem 1.1rem;

        h4{
            color: ${props => props.theme.text};
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }

        p{
            color: ${props => props.theme.textSecondary};
            line-height: 1.4;
            font-size: 0.95rem;
        }
    }

    .confirm-actions{
        margin-top: 1rem;
        display:flex;
        justify-content:flex-end;
        gap: 0.6rem;

        button{
            border: none;
            border-radius: 0.55rem;
            padding: 0.55rem 0.9rem;
            font-weight: 700;
            cursor:pointer;
        }

        .cancel-btn{
            background: ${props => props.theme.hover};
            color: ${props => props.theme.text};
            border:1px solid ${props => props.theme.border};
        }

        .delete-btn{
            background: #dc2626;
            color: #fff;
            border:1px solid #ef4444;
        }

        button:disabled{
            opacity:0.7;
            cursor:not-allowed;
        }
    }
`

export default ChatContainer
