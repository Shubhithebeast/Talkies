import React, {useState,useEffect} from 'react'
import { Link ,useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import {ToastContainer,toast} from "react-toastify";
import axios from "axios";
import { registerRoute } from '../utils/APIRoutes';
import { useTheme } from '../context/ThemeContext';

const Register = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [values,setValues] = useState({
    username:"",email:"",password:"",confirmPassword:""
  })

  // parameter use for customize toast or notifications
  const toastOptions={
      position:"bottom-right",
      autoClose:8000,
      pauseOnHover:true,
      draggable:true,
      theme: theme.name === "dark" ? "dark" : "light",
    
  }
  

  useEffect(()=>{
    // if data is stored in localstorage , means user is already logined
    // simply move to chat page
    if(localStorage.getItem("chat-app-user")){
      navigate("/");
    }
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      try {
        const { data } = await axios.post(registerRoute, {
          username, email, password
        });
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }
        if (data.status === true) {
          localStorage.setItem("chat-app-user", JSON.stringify(data.user));
          navigate("/chat");
        }
      } catch (error) {
        // Handle Axios errors and show user-friendly messages
        if (error.response) {
          if (error.response.status === 409) {
            toast.error(error.response.data.msg || "Username or email already exists.", toastOptions);
          } else if (error.response.status === 400) {
            toast.error(error.response.data.msg || "Invalid registration details.", toastOptions);
          } else {
            toast.error(error.response.data.msg || "Registration failed. Please try again.", toastOptions);
          }
        } else if (error.request) {
          toast.error("No response from server. Please check your connection.", toastOptions);
        } else {
          toast.error("An unexpected error occurred.", toastOptions);
        }
      }
    }
  }

  // handling form input validation and showing toast if there is error

  const handleValidation = () =>{
    const {password, confirmPassword, username, email} = values;

    if(password!==confirmPassword){
      toast.error("Password and Confirm Password must be same",toastOptions);
      return false;
    }else if(username.length<3){
      toast.error("Username must be longer...",toastOptions);
      return false;
    }else if(password.length<8){
      toast.error("Password must be longer...",toastOptions);
      return false;
    }else if(email===""){ 
      toast.error("Email is Invalid",toastOptions);
      return false;  
    }
    return true;
  }

  // whenever input field is change , state will update with new values
  const handleChange = (e) =>{
    setValues({...values,[e.target.name]:e.target.value});
  }

  return (
    <> 
      <FormContainer theme={theme}>
        <form onSubmit={(e)=>handleSubmit(e)}>
          <div className='brand'>
            <img src="/android-chrome-192x192.png" alt="Logo" />
            <h1>Talkies</h1>
          </div>
          <hr/>

          <input type='text' placeholder='Username' name='username' onChange={(e)=>handleChange(e)}/>
          <input type='email' placeholder='Email' name='email' onChange={(e)=>handleChange(e)}/>
          <input type='password' placeholder='Password' name='password' onChange={(e)=>handleChange(e)}/>
          <input type='password' placeholder='Confirm Password' name='confirmPassword' onChange={(e)=>handleChange(e)}/>
   
          <button type="submit">Create User</button>
          <span>Already a user?  <Link to="/login"> Login</Link></span>
          <hr/>
        </form>
      </FormContainer>
        <ToastContainer/>
    </>
    )
  }
  
  // using here styled-components library
  // helps to write css in js, with its in-built additional features
const FormContainer = styled.div`
  height:100vh;
  width:100vw;
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap:1rem;
  align-items:center;
  background: linear-gradient(160deg, ${props => props.theme.background}, ${props => props.theme.chatBg});

  .brand{
    display:flex;
    align-items:center;
    gap:1rem;
    justify-content:center;
    img{
      height:3rem;
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
    padding:3rem 5rem;

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
    color: white;
    padding: 1rem 2rem;
    border:none;
    font-weight:bold;
    cursor:pointer;
    border-radius:0.4rem;
    font-size:1rem;
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


export default Register
