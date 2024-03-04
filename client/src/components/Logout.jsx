import React from 'react'
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {BiPowerOff} from "react-icons/bi";

const Logout = () => {
    const navigate = useNavigate();

    const handleClick =()=>{
        localStorage.clear();
        navigate("/login");
    }
  return (
    <Button onClick={handleClick}>
        <BiPowerOff />
    </Button>
  )
}

const Button = styled.button`
    display:flex;
    justify-content:center;
    align-items:center;
    padding:0.5rem;
    border-radius:0.5rem;
    background-color:red;
    cursor:pointer;
    border:none;
    transition: 0.5s transform ease-in-out;
    svg{
        font-size:1.3rem;
        color:white;
    }
    &:hover{
        ${'' /* box-shadow: 2px 2px 12px 2px white; */}
        transform:scale(1.1);
    }
    ${'' /* &:focus{
        transform:scale(1);
    } */}
`

export default Logout