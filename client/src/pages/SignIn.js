import { useState } from "react";
import { NavBar } from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import config from "../config";

async function fetchUser(values) {
    return await fetch(config.serverLink + "/api/user/sign-in", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(values)
    }).then((data) => {
        return data.json()
    }).catch(error => {
        console.error(error);
    })
}


export function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        const response = await fetchUser({
            email,
            password
        });
        if (response.success) {
            localStorage.setItem("token", response.message.accessToken);
            localStorage.setItem("userId", response.message.userId);
            alert("Sign in successfully!");
            navigate("/")
        } else {
            alert(`${response.message}`);
            console.log(typeof response.message);
        }
    };
    return (
        <div>
            <NavBar/>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label><br/>
                    <input type="email" name="email" value={email} placeholder="Enter the email" onChange={e => setEmail(e.target.value)}></input><br/>
                </div>
                    <div className="form-group">
                    <label htmlFor="password">Password:</label><br/>
                    <input type="password" name="password" value={password} placeholder="Enter the password" onChange={e => setPassword(e.target.value)}></input><br/>
                </div>
                <Link to={"/sign-up"}>Don't have an account?</Link><br/>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}