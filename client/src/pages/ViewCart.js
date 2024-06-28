import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import config from "../config";
import { Link } from "react-router-dom";

async function fetchCart(userId, token, setCart) {
    try {
        const response = await fetch(config.serverLink + `/api/cart/view-cart/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const result = await response.json();
        setCart(result.message);
    } catch (error) {
        console.error("Error while fetching user: ", error.message);
    }
}

export function ViewCart() {
    const [cart, setCart] = useState(null);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchCart(userId, token, setCart);
    }, [])

    return(
        <div>
            <NavBar/>
            <h1>My Cart</h1>
            {cart !== null && token !== null ? (
                cart.map((item) => {
                    return (
                        <ul>
                            <li>Product's name: {item.product.name}</li>
                            <li>Description: {item.product.description}</li>
                            <li>Price: {item.product.price}</li>
                            <li>Quantity: {item.quantity}</li>
                            <li>Status: {item.product.status}</li>
                            <li>Shop: {item.product.shop.name}</li>
                            <li>{item.isFavourite ? "Favourite" : "Not Favourite"}</li>
                        </ul>
                    );
                })
            ) : (
                <div>
                    You need to <Link to={"/sign-in"}>Sign in</Link> or <Link to={"/sign-up"}>Sign up</Link> to use this website.
                </div>
            )}
        </div>
    )
}