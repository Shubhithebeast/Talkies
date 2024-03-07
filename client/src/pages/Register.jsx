import React, {useState,useEffect} from 'react'
import { Link ,useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import Logo from "../assets/logo.svg"
import {ToastContainer,toast} from "react-toastify";
import axios from "axios";
import { registerRoute } from '../utils/APIRoutes';

const Register = () => {
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
      theme: "dark",
    
  }
  

  useEffect(()=>{
    // if data is stored in localstorage , means user is already logined
    // simply move to chat page
    if(localStorage.getItem("chat-app-user")){
      navigate("/");
    }
  },[])

  const handleSubmit = async(e)=>{
    
    e.preventDefault();
    if(handleValidation()){
      // console.log("In handle validation...",registerRoute);
      const { email, username, password } = values;
      const {data} = await axios.post(registerRoute,{
        username,email,password
      }); 

      //react-toastify is a node.js library, helps to display notifications or toasts in a clean and customizable way
      // we can  customize the appearance and behavior of the toasts by passing options as parameters like i did toastOptions

      if(data.status===false){
        toast.error(data.msg,toastOptions);
      }
      // whenever our data is ok, will store in localStorage (its a storage in our server);
      if(data.status===true){
        // console.log("Register:  ")
        // console.log( JSON.stringify(data.user));
        // console.log("........")
        localStorage.setItem("chat-app-user",JSON.stringify(data.user));
        navigate("/");
      }
    };
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
      <FormContainer>
        <form onSubmit={(e)=>handleSubmit(e)}>
          <div className='brand'>
            <img src={Logo} alt="Logo" />
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
  background-color:#131324;

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
    padding:3rem 5rem;

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
    color: white;
    padding: 1rem 2rem;
    border:none;
    font-weight:bold;
    cursor:pointer;
    border-radius:0.4rem;
    font-size:1rem;
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
      font-weight:bold;
    }
  }
`;


export default Register