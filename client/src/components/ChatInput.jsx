import React,{useState, useEffect, useRef} from 'react'
import styled from "styled-components";
import { IoMdSend} from "react-icons/io";
import { BsEmojiSmileFill} from "react-icons/bs";
import Picker from "emoji-picker-react";

const ChatInput = ({handleSendMsg}) => {
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
    <Container>
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
    display:grid;
    grid-template-columns: 5% 95%;
    align-items: center;
    background-color:#080420;
    padding:0 2rem;
    padding-bottom:0.3rem;

    @media screen and (min-width: 720px) and (max-width:1080px){
            padding:0rem 1rem;
            gap:1rem;
        }

    .button-container{
        display:flex;
        align-items:center;
        color:white;
        gap:1rem;
        .emoji{
            position:relative;
            transition:0.5s transform ease;
            svg{
                font-size:1.5rem;
                color:yellow;
                cursor:pointer;
            }
            &:hover{
                transform: scale(1.2);
            }
            
            .EmojiPickerReact{
                position:absolute;
                bottom: 3rem; 
                box-shadow: 0 5px 10px #9a86f3;
                
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
        border-radius:2rem;
        display:flex;
        align-items:center;
        gap:2rem;
        background-color:#ffffff34;
        input{
            width:90%;
            ${'' /* height:60%; */}
            background-color:transparent;
            color:white;
            border:none;
            padding:0.8rem 1rem;
            font-size:1.3rem;
            &::selection{
                background-color:#9a86f3;
            }
            &:focus{
                outline:none;
            }
        }
        button{
            padding:0.3rem 1.7rem;
            border-radius:2rem;
            display:flex;
            justify-content:center;
            align-items:center;
            background-color:#9a86f3;
            border:none;
            cursor:pointer;

            @media screen and (min-width: 720px) and (max-width:1080px){
                padding:0.3rem 1rem;
                svg{
                    font-size:1rem;   
                 }
            }

            svg{
                font-size:1rem;
                color:white;
                 transition:transform 0.5s ease;
            &:hover{
                transform: scale(0.3);
            }
            }

        }
    }

`

export default ChatInput