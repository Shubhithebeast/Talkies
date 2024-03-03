import React from 'react';
import styled from 'styled-components';
import Robot from "../assets/robot.gif";

const Welcome = ({ currentUser }) => {
    // console.log("CurrentUser: ",currentUser);

     // Check if currentUser is defined before accessing its properties
    //  if (!currentUser) {
    //     return null; // or return a loading indicator
    // }
  return (
    <Container>
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
    color:white;
    img{
        height:17rem;
    }
    span{
        color:#4e00ff;
    }
    h3{
        line-height:2rem;
    }


`

export default Welcome