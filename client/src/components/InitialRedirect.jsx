import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const InitialRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/chat");
    } else {
      navigate("/login");
    }
  }, [navigate]);
  return null;
};

export default InitialRedirect;
