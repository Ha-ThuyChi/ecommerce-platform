import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import config from "../config";
import { Link, useNavigate } from "react-router-dom";

async function fetchCart(userId, token, setCart) {
    try {
        const response = await fetch(config.serverLink + `/api/cart/view-cart/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const result = await response.json();
        if (response.status !== 200) {
            alert(result.message);
            window.location.href = "/"
        } else {
            setCart(result.message)
        }
    } catch (error) {
        console.error("Error while fetching user: ", error.message);
    }
}

async function createOrder(token, values) {
    console.log("create order")
    try {
        const response = await fetch(config.serverLink + `/api/order/create-order`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(values)
        });
        const result = await response.json();
        console.log(result)
        return result;
    } catch (error) {
        console.error("Error while fetching user: ", error.message);
    }
}

export function ViewCart() {
    const [cart, setCart] = useState(null);
    const [shipTo, setShipTo] = useState("");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    let orderItems = [];

    useEffect(() => {
        fetchCart(userId, token, setCart);
    }, [])
    // orderItems[{productId: 1, quantity: 1},...]
    function handleCheck(e, quantity) {
        if (e.target.checked) {
            // console.log(`${e.target.value} is checked`);
            orderItems.push({productId: e.target.value, quantity: quantity})
        } else {
            orderItems = orderItems.filter(i => i.productId !== e.target.value);
        }
        console.log(orderItems)
    };
    // input: userId, shipto, orderItems
    async function handleCreateOrder(e) {
        e.preventDefault();
        const response = await createOrder(token, {
            userId,
            shipTo,
            orderItems,
        });
        console.log(response)
        if (response.success) {
            alert(response.message);
            
            window.location.reload();
        } else {
            alert(`${response.message}`);
        }
    }
    return(
        <div>
            <NavBar/>
            <h1>My Cart</h1>
            {cart !== null && cart.length > 0 ? (
                cart.map((item) => {
                    console.log(item)
                    return (
                        <div>
                            <input 
                                type="checkbox" 
                                id={item.id} value={item.product.id}
                                onChange={(e) => handleCheck(e, item.quantity)}/>
                            <label htmlFor={item.id}>
                                <ul>
                                    <li>Product's name: {item.product.name}</li>
                                    <li>Image:<br/>
                                        <img src={item.product.image} alt={`${item.product.name}`} width={500}/>
                                    </li>
                                    <li>Description: {item.product.description}</li>
                                    <li>Price: {item.product.price}</li>
                                    <li>Quantity: {item.quantity}</li>
                                    <li>Status: {item.product.status}</li>
                                    <li>Shop: {item.product.shop.name}</li>
                                    <li>{item.isFavourite ? "Favourite" : "Not Favourite"}</li>
                                </ul>
                            </label>
                        </div>
                    );
                })
            ) : (
                <div>
                    Your cart is currently empty. Shopping now? <Link to={"/"}>Add more product.</Link>
                </div>
            )}
            
            <button onClick={handleCreateOrder}>Check Out</button>
        </div>
    )
}