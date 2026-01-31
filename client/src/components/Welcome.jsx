import React from 'react';
import styled from 'styled-components';
import Robot from "../assets/robot.gif";
import { useTheme } from '../context/ThemeContext';

const Welcome = ({ currentUser }) => {
    const { theme } = useTheme();
    // console.log("CurrentUser: ",currentUser);

     // Check if currentUser is defined before accessing its properties
    //  if (!currentUser) {
    //     return null; // or return a loading indicator
    // }
  return (
    <Container theme={theme}>
        <img src={Robot} alt="Robot"  />
        <h1>
            Welcome, <span>{currentUser.username}👋</span>
        </h1>
        <h3>Please select a chat to start messaging📧</h3>
    </Container>
  )
}

const Container = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    background-color: ${props => props.theme.chatBg};
    color: ${props => props.theme.text};
    
    img{
        height:17rem;
    }
    span{
        color: ${props => props.theme.primary};
        font-weight: 600;
    }
    h1 {
        margin: 1rem 0;
        font-size: 2rem;
    }
    h3{
        line-height:2rem;
        color: ${props => props.theme.textSecondary};
    }
`

export default Welcome