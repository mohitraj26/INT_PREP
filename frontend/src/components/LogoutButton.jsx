import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";


const LogoutButton = ({children}) => {
    const {logout} = useAuthStore();
    const navigate = useNavigate();

    const onLogout = async() => {
       await logout();
        navigate("/");
    }
    return (
        <button 
         onClick={onLogout}
         className={`w-full flex items-center px-4 py-2 text-sm text-red-500 hover:text-red-600`}
        >
            <LogOut className="w-4 h-4 mr-3" />
            <span>Logout</span>
            {children}
        </button>
    )
}

export default LogoutButton;