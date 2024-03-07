import React, { useEffect, useState ,useRef} from 'react'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom';
import { allUsersRoute,host } from '../utils/APIRoutes';
import axios from "axios";
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import {io}  from "socket.io-client";

const Chat = () => {
  const socket = useRef();

  const navigate = useNavigate();
  const [contacts,setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] =useState(undefined);
  const [isLoaded,setIsLoaded]=useState(false);

  // Error no.1 IssueFaces.md
  // useEffect(async()=>{

  //     if(!localStorage.getItem("chat-app-user")){
  //       navigate("/login");
  //     }else{
  //       setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
  //     }
    
  // },[])

  useEffect(()=>{
    async function setUser(){

      if(!localStorage.getItem("chat-app-user")){
        navigate("/login");
      }else{
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        setIsLoaded(true);
      }
    }  
    setUser();
  },[])

  useEffect(()=>{
    if(currentUser){
      socket.current = io(host);
      socket.current.emit( "add user", currentUser._id );
    }
  },[currentUser])

  
  useEffect( () => {
    // console.log("CurrentUser: ",currentUser)
    const fetchData = async () => {
      try {
        if (currentUser) {
          // console.log("currentUser0:", currentUser);
          if (currentUser.isAvatarImageSet) {
            // console.log("Inside getallusers.")
            const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            // console.log("fetch Data of contacts:", data.data);
            setContacts(data.data);
          } else {
            navigate("/setavatar");
          }
          // console.log("contacts:", contacts); 

        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error as needed
      }
    };
    fetchData();
  }, [currentUser]);

  const handleChatChange = (chat) =>{
    setCurrentChat(chat);
  }


  return (
    <Container>
      <div className="container">
      {/* {console.log("CurrentUser1 is: ",currentUser)} */}
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
       {/* {console.log("CurrentUser2 is: ",currentUser.username)} */}

        {
          isLoaded && currentChat === undefined ? (
            <Welcome currentUser={currentUser}  />
          ):
           (
            <ChatContainer currentChat={currentChat}  currentUser={currentUser} socket={socket} />
           )
        }
      </div>
    </Container>
  )
} 


const Container = styled.div`
  height:100vh;
  width:100vw;
  display:flex;
  flex-direction:column;

  justify-content:center;
  align-items:center;
  gap:1rem;
  background-color:#131324;
    .container{
      height:85vh;
      width:85vw;
      background-color:#00000076;
      display:grid;
      grid-template-columns: 25% 75%;
      @media screen and (min-width: 720px) and  (max-width: 1080px){
        grid-template-columns: 35% 65%;
      }
    }
`;

export default Chat