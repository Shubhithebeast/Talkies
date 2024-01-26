import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Logo from "../assets/logo.svg";

const Contacts = ({contacts,currentUser}) => {

    const [currentUserName,setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);


    useEffect(()=>{
        console.log("contacts:",contacts)
        if(currentUser){
            setCurrentUserName(currentUser.username);
            setCurrentUserImage(currentUser.avatarImage);
        }
    },[currentUser]);

    const changeCurrentChat = (index,contact)=> {};


  return (
    <>
        {currentUserName && currentUserImage && (
            <Container>
                <div className='brand'>
                    <img src={Logo} alt="Logo" />
                    <h3>LetsTalk</h3>
                </div>
                <div className='contacts'>
                    {
                        contacts.map((contact,index)=>{
                            return(
                                <div key={index}
                                className={`contact 
                                    ${index==currentSelected ? "selected" : ""}`}
                                    onClick={() => changeCurrentChat(index,contact)}
                                >
                                    <div className='avatar'>
                                        <img 
                                            src={`data:image/svg+xml;base64,${contact.avatarImage}`}
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
                        <img src={`data:image/svg+xml;base64,${currentUserImage}`} 
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
    background-color:#080420;
    .brand{
        display:flex;
        align-items:center;
        gap:1rem;
        justify-content:center;
        img{
            height:2rem;
        }
        h3{
            color:white;
            text-transform:uppercase;
        }
    }

    .contacts{
        display:flex;
        flex-direction:column;
        align-items:center;
        overflow:auto;
        gap:0.8rem;
        &::-webkit-scrollbar{
            width:0.2rem;
            &-thumb{
                background-color:#ffffff39
                width:0.1rem;
                border-radius:1rem;
            }
        }
        .contact{
            background-color:#ffffff34;
            min-height:5rem;

        }
    }

`;

export default Contacts