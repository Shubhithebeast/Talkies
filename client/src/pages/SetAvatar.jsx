import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast,ToastContainer } from 'react-toastify';
import loader from '../assets/loader.gif'
import styled from 'styled-components';
import axios from 'axios';
import {Buffer} from 'buffer';
import { setAvatarRoute } from '../utils/APIRoutes';

const SetAvatar = () => {
    
    console.log("base url: ", process.env.REACT_APP_BASE_URL);
    const api = `${process.env.REACT_APP_BASE_URL}/api/avatar`;
    const navigate = useNavigate();

    const [avatars,setAvatars] = useState([]);
    const [selectedAvatar,setSelectedAvatar] = useState(undefined);
    const [isLoading,setIsLoading] = useState(true);

    const toastOptions = {
        position:"bottom-right",
        autoClose:8000,
        pauseOnHover:true,
        draggable:true,
        theme:"dark",
    }

    const setProfilePicture =  async () =>{

        if(selectedAvatar===undefined){
            toast.error("Please select an avatar!",toastOptions);
        }else{
            const user = await JSON.parse(localStorage.getItem("chat-app-user"));
            const {data} = await axios.post(`${setAvatarRoute}/${user._id}`,{
                image:avatars[selectedAvatar]
            })
            // console.log(data);

            if(data.isSet){
                user.isAvatarImageSet=true;
                user.avatarImage = data.image;
                navigate("/");
            }else{
                toast.error("Something went wrong! Try Again...",toastOptions)
            }
        }
    }

    

    useEffect(() => {
        if(!localStorage.getItem("chat-app-user")){
            navigate("/login");
        }


        async function fetchData() {
            try {
                const data = [];
                const used = new Set();
                while (data.length < 5) {
                    // Generate a unique random number in a large range
                    const randomNumber = Math.floor(Math.random() * 1000000);
                    if (used.has(randomNumber)) continue;
                    used.add(randomNumber);
                    const { data: res } = await axios.get(`${api}/${randomNumber}`);
                    data.push(res.image);
                }
                setAvatars(data);
                setIsLoading(false);
            } catch (error) {
                console.log("Error in fetching Avatars", error);
            }
        }

        fetchData();
    }, []);

    return (
        <>
        {
            isLoading ? (
                <Container>
                    <img src={loader} alt="loader" className='loader'/>
                </Container>
            ):(
                <Container>
                <div className="title-container">
                    <h1>Pick an avatar for your profile picture</h1>
                </div>

                <div className='avatars'>
                 {
                    avatars.map((avatar,ind) =>{
                        return(
                            <div key={ind} 
                                className={`avatar ${selectedAvatar===ind ? "selected" :"" }`}
                            >
                                <img 
                                    src={avatar}
                                    alt="avatar"
                                    key={avatar}
                                    onClick={()=> setSelectedAvatar(ind)}
                                />
                                
                            </div>
                        )
                    })
                 }                
                </div>
                <button className="submit-btn" onClick={setProfilePicture}>
                        Set as Profile Picture
                </button>

            </Container>
        )}
            <ToastContainer/>
        </>
    )
}

const Container = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    gap:4rem;
    background-color:#131324;
    width:100vw;
    height:100vh;

    .title-container{
        h1{
            color:white;
        }
    }
    .loader {
    max-inline-size: 100%;
  }

    .avatars{
        display:flex;
        gap:2rem;

        .avatar{
            border:0.4rem dotted transparent;
            padding:0.4rem;
            border-radius:5rem;
            display:flex;
            justify-content:center;
            align-items:center;
            transition:0.5s ease-in-out;
            img{
                height:6rem;
                transition:0.5s ease-in-out;
            }
        }
        .selected{
            border:0.4rem groove #4e0eff;
        }
    }


    .submit-btn{
        background-color: #4e0eff;
        color:white;
        padding:1rem 2rem;
        border:none;
        font-weight:bolder;
        font-stretch: expanded;
        cursor:pointer;
        border-radius:0.5rem;
        font-size:1.1rem;
        text-transform:uppercase;
        transition: 0.5s transform ease-in-out;
        &:hover{
            ${'' /* background-color:#541bf0d2; */}
            transform:scale(1.05);
        }

    }
`;

export default SetAvatar;