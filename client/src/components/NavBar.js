import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";


export function NavBar() {
    const [token, setToken] = useState("");

    useEffect(() => {
        const loggined = localStorage.getItem("token");
        if (loggined) {
            const foundToken = loggined;
            setToken(foundToken);
        }
    }, []);

    function handleSignout() {
        setToken("")
        localStorage.clear();
        window.location.reload();
    }
    return(
        <div className="nav-links">
          
            {token === "" ? (  
                <>
                    <NavLink className={"nav-link"} to={"/"}>Homepage</NavLink>
                    <NavLink className={"nav-link"} to={"/sign-up"}>Sign up</NavLink>
                    <NavLink className={"nav-link"} to={"/sign-in"}>Sign in</NavLink>
                </>
            ) : (
                <>
                    <NavLink className={"nav-link"} to={"/"}>Homepage</NavLink>
                    <NavLink className={"nav-link"} to={"/view-profile"}>My Profile</NavLink>
                    <NavLink className={"nav-link"} to={"/view-cart"}>My Cart</NavLink>
                    <button onClick={handleSignout}>Sign out</button><br/> 
                </>
            )
        }
        </div>
    )
}