import React,{useState, useEffect, useRef} from 'react'
import styled from "styled-components";
import { IoMdSend} from "react-icons/io";
import { BsEmojiSmileFill} from "react-icons/bs";
import { BsPaperclip } from "react-icons/bs";
import Picker from "emoji-picker-react";
import { useTheme } from '../context/ThemeContext';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ChatInput = ({handleSendMsg, onTyping, onStopTyping}) => {
    const { theme } = useTheme();
    const [showEmojiPicker,setShowEmojiPicker] = useState(false);
    const [msg,setMsg] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const emojiPickerRef = useRef(null);
    const fileInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

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

    const triggerTyping = () => {
        if (onTyping) onTyping();
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            if (onStopTyping) onStopTyping();
        }, 1200);
    };

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleFilePick = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            alert("File is too large. Please choose a file up to 5 MB.");
            event.target.value = "";
            return;
        }

        const dataUrl = await toBase64(file);
        setSelectedFile({
            fileName: file.name,
            fileType: file.type || "application/octet-stream",
            fileSize: file.size,
            data: dataUrl,
        });
        event.target.value = "";
    };

    const clearSelectedFile = () => {
        setSelectedFile(null);
    };

    const sendChat = async (event)=>{
        event.preventDefault();

        const trimmed = msg.trim();
        if (!trimmed && !selectedFile) return;

        await handleSendMsg({
            message: trimmed,
            messageType: selectedFile ? "file" : "text",
            attachment: selectedFile,
        });
        setMsg("");
        setSelectedFile(null);
        if (onStopTyping) onStopTyping();
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

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
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

            <button
                type="button"
                className="attach-btn"
                title="Attach file"
                onClick={() => fileInputRef.current?.click()}
            >
                <BsPaperclip />
            </button>
            <input
                ref={fileInputRef}
                type="file"
                className="file-input"
                onChange={handleFilePick}
                accept="image/*,video/*,.pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.zip"
            />
        </div>
        <form className='input-container' onSubmit={(e)=>sendChat(e)}>
            <div className="input-stack">
                {selectedFile && (
                    <div className="file-chip">
                        <span>{selectedFile.fileName}</span>
                        <button type="button" onClick={clearSelectedFile}>x</button>
                    </div>
                )}
                <input
                    type='text'
                    placeholder='Type your message here...'
                    value={msg}
                    onChange={(e)=> {
                        setMsg(e.target.value);
                        triggerTyping();
                    }}
                    onFocus={triggerTyping}
                    onBlur={() => onStopTyping && onStopTyping()}
                />
            </div>
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
        gap: 0.35rem;
        justify-content: center;
        width: auto;
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

        .attach-btn{
            width: 2.1rem;
            height: 2.1rem;
            border-radius: 50%;
            border: 1px solid ${props => props.theme.border};
            background: transparent;
            color: ${props => props.theme.primaryLight};
            display:flex;
            justify-content:center;
            align-items:center;
            cursor:pointer;
            transition: 0.2s ease;
            &:hover{
                background: ${props => props.theme.hover};
                transform: translateY(-1px);
            }
            svg{
                font-size: 1rem;
            }
        }

        .file-input{
            display:none;
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

        .input-stack{
            flex: 1;
            min-width: 0;
            display:flex;
            flex-direction:column;
            gap: 0.25rem;
        }

        .file-chip{
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap: 0.6rem;
            padding: 0.25rem 0.55rem;
            border-radius: 0.6rem;
            background: ${props => props.theme.hover};
            color:${props => props.theme.text};
            font-size: 0.82rem;
            max-width: 100%;

            span{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            button{
                width: 1.1rem;
                height: 1.1rem;
                border-radius: 50%;
                border: none;
                background: ${props => props.theme.primary};
                color: #fff;
                padding: 0;
                font-size: 0.7rem;
                display:flex;
                align-items:center;
                justify-content:center;
                box-shadow: none;
            }
        }

        input{
            width:100%;
            min-width: 0;
            background-color:transparent;
            color:${props => props.theme.inputText};
            border:none;
            padding:0.3rem 0.2rem;
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

        .submit{
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
