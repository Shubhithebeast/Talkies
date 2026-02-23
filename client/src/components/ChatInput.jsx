import React,{useState, useEffect, useRef} from 'react'
import styled from "styled-components";
import { IoMdSend} from "react-icons/io";
import { BsEmojiSmileFill} from "react-icons/bs";
import Picker from "emoji-picker-react";
import { useTheme } from '../context/ThemeContext';

const ChatInput = ({handleSendMsg}) => {
    const { theme } = useTheme();
    const [showEmojiPicker,setShowEmojiPicker] = useState(false);
    const [msg,setMsg] = useState("");
    const emojiPickerRef = useRef(null);

    const handleEmojiPickerToggle =()=>{
        setShowEmojiPicker(!showEmojiPicker);
    }

    const handleEmojiClick =(emoji,event)=>{
        // console.log("emoji: ",emoji);
        let message = msg;
        message += emoji.emoji;
        // console.log("meassage: ",message);
        // console.log("emoji.emoji: ",emoji.emoji);


        setMsg(message); 
    }

    const sendChat = (event)=>{
        event.preventDefault();
        if(msg.length>0){
            handleSendMsg(msg);
            setMsg("");
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

  return (
    <Container theme={theme}>
        <div className='button-container'>
            <div className='emoji' ref={emojiPickerRef}>
                <BsEmojiSmileFill  onClick={handleEmojiPickerToggle} />

                {
                    showEmojiPicker && <Picker width="280px" height="320px" onEmojiClick={handleEmojiClick}/>
                }
            </div>
        </div>
        <form className='input-container' onSubmit={(e)=>sendChat(e)}>
            <input type='text' placeholder='Type your message here...' value={msg} onChange={(e)=> setMsg(e.target.value)} />
            <button className='submit'>
                <IoMdSend />
            </button>
        </form>
    </Container>
  )
}

const Container =styled.div` 
    display:flex;
    align-items: center;
    gap: 0.8rem;
    background-color:${props => props.theme.inputBarBg};
    padding:0.7rem 1rem;
    border-top: 1px solid ${props => props.theme.border};

    @media screen and (min-width: 720px) and (max-width:1080px){
        padding:0.6rem 0.8rem;
        gap:0.6rem;
    }

    .button-container{
        display:flex;
        align-items:center;
        justify-content: center;
        width: 2.5rem;
        flex-shrink: 0;

        .emoji{
            position:relative;
            transition:0.5s transform ease;

            svg{
                font-size:1.5rem;
                color:#facc15;
                cursor:pointer;
            }

            &:hover{
                transform: scale(1.08);
            }
            
            .EmojiPickerReact{
                position:absolute;
                bottom: 3rem;
                box-shadow: 0 8px 18px ${props => props.theme.shadow};
                
                .epr-emoji-category-label {
                    font-size: 0.85rem;
                }
                
                button.epr-emoji {
                    width: 28px !important;
                    height: 28px !important;
                    
                    &:hover {
                        transform: scale(1.1);
                    }
                    
                    span {
                        font-size: 1.2rem !important;
                    }
                }
            }
        }
    }
    .input-container{
        width:100%;
        min-width: 0;
        border-radius:2rem;
        display:flex;
        align-items:center;
        gap:0.5rem;
        padding: 0.3rem 0.35rem 0.3rem 0.9rem;
        background-color:${props => props.theme.inputInnerBg};
        border: 1px solid ${props => props.theme.border};

        input{
            width:100%;
            min-width: 0;
            background-color:transparent;
            color:${props => props.theme.inputText};
            border:none;
            padding:0.5rem 0.2rem;
            font-size:1.1rem;

            &::placeholder{
                color: ${props => props.theme.textSecondary};
                opacity: 0.9;
            }

            &::selection{
                background-color:${props => props.theme.primaryLight};
                color: #fff;
            }

            &:focus{
                outline:none;
            }
        }

        button{
            width: 2.6rem;
            height: 2.6rem;
            flex-shrink: 0;
            border-radius:50%;
            display:flex;
            justify-content:center;
            align-items:center;
            background-color:${props => props.theme.sendBtnBg};
            box-shadow: 0 4px 10px ${props => props.theme.shadow};
            border:none;
            cursor:pointer;
            transition: transform 0.2s ease, background-color 0.2s ease;

            @media screen and (min-width: 720px) and (max-width:1080px){
                width: 2.35rem;
                height: 2.35rem;
            }

            svg{
                font-size:1.1rem;
                color:white;
                margin-left: 0.1rem;
            }
            &:hover{
                background-color: ${props => props.theme.sendBtnHover};
                transform: translateY(-1px);
            }
        }
    }
`

export default ChatInput
