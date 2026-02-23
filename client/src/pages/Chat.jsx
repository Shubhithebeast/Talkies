import React, { useEffect, useState ,useRef} from 'react'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom';
import { allUsersRoute,host } from '../utils/APIRoutes';
import axios from "axios";
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import {io}  from "socket.io-client";
import { useTheme } from '../context/ThemeContext';

const Chat = () => {
  const socket = useRef();
  const { theme } = useTheme();

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


  useEffect(() => {
    async function setUser() {
      const userData = localStorage.getItem("chat-app-user");
      if (!userData) {
        navigate("/login");
      } else {
        const user = JSON.parse(userData);
        if (!user.isAvatarImageSet) {
          navigate("/setavatar");
          return;
        }
        setCurrentUser(user);
        setIsLoaded(true);
      }
    }
    setUser();
  }, []);

  useEffect(()=>{
    if(currentUser){
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  },[currentUser])

  

  useEffect(() => {
    let intervalId;
    const fetchData = async () => {
      try {
        if (currentUser && currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (currentUser) {
      fetchData();
      intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentUser]);

  const handleChatChange = (chat) =>{
    setCurrentChat(chat);
  }


  return (
    <Container theme={theme}>
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
  padding: 1.2rem;
  background: linear-gradient(165deg, ${props => props.theme.background}, ${props => props.theme.chatBg});
  
    .container{
      height:min(88vh, 900px);
      width:min(92vw, 1400px);
      background-color: ${props => props.theme.containerBg};
      display:grid;
      grid-template-columns: 25% 75%;
      border: 1px solid ${props => props.theme.border};
      border-radius: 1.1rem;
      overflow: hidden;
      box-shadow: 0 14px 34px ${props => props.theme.shadow};
      
      @media screen and (min-width: 720px) and  (max-width: 1080px){
        grid-template-columns: 35% 65%;
      }

      @media screen and (max-width: 719px){
        width: 96vw;
        height: 92vh;
      }
    }
`;

export default Chat
