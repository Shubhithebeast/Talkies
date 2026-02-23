import React, { useState,useEffect } from 'react'
import Logo from "../assets/logo.svg"
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import { toast,ToastContainer } from 'react-toastify'
import axios from 'axios'
import {loginRoute} from '../utils/APIRoutes';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const { theme } = useTheme();

  const navigate = useNavigate();

  const [values,setValues] = useState({
    username:"",password:""
  })

  const toastOptions ={
    position:"bottom-right",
    autoClose:8000,
    pauseOnHover:true,
    draggable:true,
    theme: theme.name === "dark" ? "dark" : "light"
  }

  useEffect(()=>{
    if(localStorage.getItem("chat-app-user")){
      // console.log("User already logined...");
      navigate("/");
    }
  },[])


  const handleSubmit = async(event) =>{
    event.preventDefault();

    if(handleValidation()){
      const {password,username} = values;

      const {data} = await axios.post(loginRoute,{
        username,password
      });

      if(data.status===false){
        toast.error(data.msg,toastOptions);
      }
      if(data.status===true){
        // console.log("login:  ")
        // console.log( JSON.stringify(data.user));
        // console.log("........")
        localStorage.setItem("chat-app-user",JSON.stringify(data.user));
        navigate("/");
      }
    }

  }

  const handleValidation = ()=>{
    const {username,password}= values;

    if(password==="" || username===""){
      toast.error("Username and Password must be valid",toastOptions);
      return false;
    }

    return true;

  }

  const handleChange = (event) =>{
    setValues({...values,[event.target.name]:event.target.value});
  }

  return (
    <>
      <FormContainer theme={theme}>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className='brand'>
            <img src={Logo} alt="Logo" />
            <h1>Talkies</h1>
          </div>
          <hr></hr>

          <input type='text' placeholder='Username' name='username' onChange={(event)=> handleChange(event)} />
          <input type='password' placeholder='Password' name='password' onChange={(event)=> handleChange(event)} />
         
          <button type="submit">Login</button>
          <span>Create new Account <Link to="/register">Register</Link></span>
          <hr/>
        </form>
      </FormContainer>
      <ToastContainer/>
    </>
  )
}

const FormContainer = styled.div`
 background: linear-gradient(160deg, ${props => props.theme.background}, ${props => props.theme.chatBg});
 height:100vh;
 width:100vw;
 display:flex;
 flex-direction:column;
 justify-content:center;
 align-items:center;
 gap:1rem;

 .brand{
  display:flex;
  align-items:center;
  gap:1rem;
  justify-content:center;
  img{
    height:5rem;
  }
  h1{
    color:${props => props.theme.text};
  }
 }

 form{
  display:flex;
  flex-direction:column;
  gap:2rem;
  background-color:${props => props.theme.containerBg};
  border:1px solid ${props => props.theme.border};
  box-shadow: 0 12px 28px ${props => props.theme.shadow};
  border-radius:2rem;
  padding: 3rem 5rem;
 }

 input{
  background-color:transparent;
  padding:1rem;
  border:0.1rem solid ${props => props.theme.border};
  border-radius:0.4rem;
  color:${props => props.theme.text};
  width:100%;
  font-size:1.2rem;
  &::placeholder{
    color:${props => props.theme.textSecondary};
  }
  &:focus{
    border: 0.12rem solid ${props => props.theme.primary};
    outline:none;
  }

 }

 button{
  background-color:${props => props.theme.primary};
  color:white;
  padding: 1rem 2rem;
  border:none;
  ${'' /* border: 0.1rem groove white; */}
  font-weight:bold;
  cursor:pointer; 
  border-radius:0.4rem;
  font-size:1rem;
  text-transform:uppercase;
  transition: 0.5s transform ease-in-out;
  &:hover{
      background-color:${props => props.theme.primaryLight};
      transform:scale(1.05);
  }
 }

 span{
  color:${props => props.theme.text};
  text-transform:uppercase;
  a{
    color:${props => props.theme.primary};
    text-decoration:none;
    font-weight:bold;
  }
 }

`;

export default Login
