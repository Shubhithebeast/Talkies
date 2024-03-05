import React,{useState} from 'react'
import styled from "styled-components";
import { IoMdSend} from "react-icons/io";
import { BsEmojiSmileFill} from "react-icons/bs";
import Picker from "emoji-picker-react";

const ChatInput = ({handleSendMsg}) => {
    const [showEmojiPicker,setShowEmojiPicker] = useState(false);
    const [msg,setMsg] = useState("");

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

  return (
    <Container>
        <div className='button-container'>
            <div className='emoji'>
                <BsEmojiSmileFill  onClick={handleEmojiPickerToggle} />

                {
                    showEmojiPicker && <Picker width="300px" height="400px" onEmojiClick={handleEmojiClick}/>
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
                top: -26rem; 
                box-shadow: 0 5px 10px #9a86f3;
            
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
            padding-left:1rem;
            font-size:1.2rem;
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
                font-size:2rem;
                color:white;
                 transition:transform 0.5s ease;
            &:hover{
                transform: scale(1.2);
            }
            }

        }
    }

`

export default ChatInput