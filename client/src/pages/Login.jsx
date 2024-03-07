import React, { useState,useEffect } from 'react'
import Logo from "../assets/logo.svg"
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import { toast,ToastContainer } from 'react-toastify'
import axios from 'axios'
import {loginRoute} from '../utils/APIRoutes';

const Login = () => {

  const navigate = useNavigate();

  const [values,setValues] = useState({
    username:"",password:""
  })

  const toastOptions ={
    position:"bottom-right",
    autoClose:8000,
    pauseOnHover:true,
    draggable:true,
    theme:"dark"
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
      <FormContainer>
       <form onSubmit={(event) => handleSubmit(event)}>
        <div className='brand'>
          <img src={Logo} alt="Logo" />
          <h1>Talkies</h1>
        </div>
          <hr></hr>

        <input type='text' placeholder='Username' name='username' onChange={(event)=> handleChange(event)} />
        <input type='password' placeholder='Password' name='password' onChange={(event)=> handleChange(event)} />
       
        <button type="submit">Login</button>
        <span>Create new Account <Link to="/register">Register</Link></span><hr/>
       
       </form>
      </FormContainer>
      <ToastContainer/>
    </>
  )
}

const FormContainer = styled.div`
 background-color:#131324;
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
    color:white;
  }
 }

 form{
  display:flex;
  flex-direction:column;
  gap:2rem;
  background-color:#00000076;
  border-radius:2rem;
  padding: 3rem 5rem;
 }

 input{
  background-color:transparent;
  padding:1rem;
  border:0.1rem inset #4e0eff;
  border-radius:0.4rem;
  color:white;
  width:100%;
  font-size:1.2rem;
  &:focus{
    border: 0.18rem outset #4e0eff;
    outline:none;
  }

 }

 button{
  background-color:#4e0eff;
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
      ${'' /* background-color:#541bf0d2; */}
      transform:scale(1.05);
  }
 }

 span{
  color:white;
  text-transform:uppercase;
  a{
  color:#4e0eff;
  text-decoration:none;
  font-weight:bold
 }

`;

export default Login