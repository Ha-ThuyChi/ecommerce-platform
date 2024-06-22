import { Link, useNavigate } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import config from "../config";
import { useState } from "react";

async function createUser(values) {
    return fetch(config.serverLink + "/api/user/create-user", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(values)
    }).then((data) => {
        return data.json()
    }).catch(error => {
        console.error(error);
    });
}

export function SignUp() {
    const role = "Buyer";
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const navigate = useNavigate();
    
    async function handleSubmit(e) {
        e.preventDefault();
        const response = await createUser({
            email,
            name,
            dob,
            password,
            phone,
            address,
            role
        });
        if (response.success) {
            alert("Your account is created successfully!");
            navigate("/sign-in");
        } else {
            alert(response.message)
        };
        
        if (response.status === 401) {
            localStorage.clear();
            window.location.reload();
        } else if (response.status === 400) {
            console.log(response.message);
        };
    }
    return (
        <div>
            <NavBar/>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Full name:</label><br/>
                    <input type="text" name="name" value={name} placeholder="Enter the name" onChange={e => setName(e.target.value)}></input><br/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label><br/>
                    <input type="email" name="email" value={email} placeholder="Enter the email" onChange={e => setEmail(e.target.value)}></input><br/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label><br/>
                    <input type="password" name="password" value={password} placeholder="Enter the password" onChange={e => setPassword(e.target.value)}></input><br/>
                </div>
                <div className="form-group">
                    <label htmlFor="dob">Date of birth:</label><br/>
                    <input type="date" name="dob" value={dob} onChange={e => setDob(e.target.value)}></input><br/>
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone number:</label><br/>
                    <input type="text" name="phone" value={phone} onChange={e => setPhone(e.target.value)}></input><br/>
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address:</label><br/>
                    <input type="text" name="address" value={address} onChange={e => setAddress(e.target.value)}></input><br/>
                </div>
                <Link to={"/sign-in"}>Have an account?</Link><br/>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}