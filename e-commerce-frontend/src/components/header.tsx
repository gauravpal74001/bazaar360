import { useState } from "react";
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";

interface PropsUser{
    user:User | null 
};

const Header = ({user}:PropsUser) => {
    const [isOpen , setIsOpen] = useState<boolean>(false);

    const closeDialog = () => setIsOpen(false);
    const logoutHandler = async()=>{
       try{
        await signOut(auth);
        setIsOpen(false);
        toast.success("signout successful")
       }catch(error){
        toast.error("signout failed")
       }
    }

    return (
      <nav className="header">
        <div>
          <Link  onClick={closeDialog} to={"/"}>Home</Link>
          <Link onClick={closeDialog} to={"/search"}><FaSearch/></Link>
          <Link onClick={closeDialog} to={"/cart"}><FaShoppingBag/></Link>
          {user?._id ? (
            <>
              <button onClick={() => setIsOpen((prev) => !prev)}><FaUser/></button>  
              <dialog open={isOpen}>
                <div>
                  {user!.role === "admin" && (
                    <Link onClick={closeDialog} to="/admin/dashboard">Admin</Link>
                  )}
                  <Link onClick={closeDialog} to="/orders">Orders</Link>
                  <button onClick={logoutHandler}><FaSignOutAlt/></button> 
                </div>
              </dialog>
            </>
          ) : (
            <Link to={"/login"}><FaSignInAlt/></Link>
          )}
        </div>
      </nav>
    );
};

export default Header;
