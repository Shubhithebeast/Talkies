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
    background-color:#dc2626;
    cursor:pointer;
    border:1px solid #ef4444;
    transition: 0.2s transform ease, background-color 0.2s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
    svg{
        font-size:1.3rem;
        color:white;
    }
    &:hover{
        transform:translateY(-1px);
        background-color:#b91c1c;
    }
`

export default Logout
