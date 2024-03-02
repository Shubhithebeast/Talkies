import React,{useState} from 'react'
import styled from "styled-components";
import { IoMdSend} from "react-icons/io";
import { BsEmojiSmileFill} from "react-icons/bs";
import Picker from "emoji-picker-react";

const ChatInput = () => {
  return (
    <Container>
        <div className='button-container'>
            <div className='emoji'>
                <BsEmojiSmileFill />
            </div>
        </div>
        <form className='input-container'>
            <input type='text' placeholder='Type your message here...' />
            <button className='submit'>
                <IoMdSend />
            </button>
        </form>
    </Container>
  )
}

const Container =styled.div`

`

export default ChatInput