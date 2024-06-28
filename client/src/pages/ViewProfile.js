import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import config from "../config";
import { Link } from "react-router-dom";

async function fetchUser(userId, token, setUser) {
    try {
        const response = await fetch(config.serverLink + `/api/user/view-user/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const result = await response.json();
        setUser(result.message);
    } catch (error) {
        console.error("Error while fetching user: ", error.message);
    }
}

export function ViewProfile() {
    const [user, setUser] = useState(null);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        fetchUser(userId, token, setUser);
    }, []);

    return(
        <div>
            <NavBar/>
            <h1>My Profile</h1>
            {user !== null && token !== null ? (
                <ul>
                    <li>Full name: {user.name}</li>
                    <li>Address: {user.address}</li>
                    <li>Date of birth: {user.dob.split("T")[0]}</li>
                    <li>Email: {user.email}</li>
                    <li>Phone: {user.phone}</li>
                </ul>
            ) : (
                <div>
                    You need to <Link to={"/sign-in"}>Sign in</Link> or <Link to={"/sign-up"}>Sign up</Link> to use this website.
                </div>
            )}
        </div>
    )
}