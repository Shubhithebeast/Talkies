import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

import Register from './pages/Register';
import Chat from './pages/Chat';
import Login from './pages/Login';
import SetAvatar from './pages/SetAvatar';
import Profile from './pages/Profile';
import InitialRedirect from './components/InitialRedirect';
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register/>}  />
          <Route path="/login" element={<Login/>}  />
          <Route path="/setavatar" element={<SetAvatar />}  />
          <Route path="/chat" element={<Chat/>}  />
          <Route path="/profile" element={<Profile />}  />
          <Route path="/" element={<InitialRedirect />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;