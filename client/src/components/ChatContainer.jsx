import React,{useState,useEffect,useRef} from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from "styled-components";
import Logout from './Logout';
import ChatInput from './ChatInput';
import axios from  'axios';
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';
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
            socket.current.on("msg-receive", (msg) => {
                console.log("msg-receive event:", msg);
                setArrivalMessage({ fromSelf: false, message: msg });
            });
        }
    }, []);


    useEffect(()=>{
        arrivalMessage && setMessages((prev) => [...prev,arrivalMessage]);
        // console.log("Arrival.msg...",arrivalMessage);
    },[arrivalMessage])

    useEffect(()=>{
        scrollRef.current?.scrollIntoView({ behavior:"smooth"});
    },[messages]);

    return (
        <>
            {currentChat && (
                <Container theme={theme}>
                    <div className="chat-header">
                        <div className='user-details'>
                            <div className='avatar'>
                                <img
                                    src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                                    alt="avatar"
                                />
                            </div>
                            <div className='username'>
                                <h3>{currentChat.username}</h3>
                            </div>
                        </div>
                        <Logout />
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
                </Container>
            )}
            <ToastContainer />
        </>
    )
}

const Container = styled.div`
    padding-top:1rem;
    display:grid;
    grid-template-rows:10% 78% 12%;
    gap: 0.1rem;
    overflow:hidden;
    background-color: ${props => props.theme.chatBg};

    @media screen and (min-width: 720px) and (max-width:1080px){
        grid-auto-rows: 15% 70% 15%;
    }

    .chat-header{
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:0 2rem;
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
                }
            }
        }
    }

    .chat-messages{
        padding: 1rem 2rem;
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