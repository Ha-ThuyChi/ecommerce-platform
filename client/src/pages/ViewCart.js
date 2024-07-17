import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import config from "../config";
import { Link, useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';

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
};

async function createOrder(token, values) {
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
        console.error("Error while create order: ", error.message);
    }
};

async function updateQuantity(token, values) {
    try {
        const response = await fetch(config.serverLink + `/api/cart/update-quantity`, {
            method: "PUT",
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
        console.error("Error while update quantity: ", error.message);
    }
};

async function updateFavourite(token, values) {
    try {
        const response = await fetch(config.serverLink + `/api/cart/update-favourite`, {
            method: "PUT",
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
        console.error("Error while update favourite: ", error.message);
    }
};

async function deleteItem(token, values) {
    try {
        const response = await fetch(config.serverLink + `/api/cart/delete-item`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
        });
        const result = await response.json();
        console.log(result)
        return result;
    } catch (error) {
        console.error("Error while delete item: ", error.message);
    }
};

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
        if (response.success) {
            alert(response.message);
            
            window.location.reload();
        } else {
            alert(`${response.message}`);
        }
    };
    // input: userId, shipto, orderItems
    async function handleUpdate(e, productId, cartId) {
        e.preventDefault();
        let action;
        if (e.target.textContent === "+") {
            action = "increase"
        } else {
            action = "decrease"
        };
        const response = await updateQuantity(token, {
            productId,
            cartId,
            action
        });
        if (response.success) {
            window.location.reload();
        } else {
            alert(`${response.message}`);
        }
    };
    async function handleFavourite(e, productId, cartId, favourite) {
        e.preventDefault();
        const isFavourite = !favourite;
        const response = await updateFavourite(token, {
            productId,
            cartId,
            isFavourite
        });
        console.log(response)
        if (response.success) {
            window.location.reload();
        } else {
            alert(`${response.message}`);
        }
    };
    function handleDelete(e, productId, cartId, name) {
        confirmAlert({
            title: `DELETE PRODUCT`,
            message: `Are you sure you want to delete ${name}?`,
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => {
                        const response = await deleteItem(token, {
                            cartId, 
                            productId
                        });
                        console.log(response)
                        if (response.success) {
                            alert(`Item ${name} is deleted successfully!`);
                            window.location.reload();
                        }
                    },
                },
                {
                    label: "No",
                    onClick: () => {
                        console.log("Cancel delete")
                    },
                }
            ]
        });
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
                                    <li>Quantity: {item.quantity > 1 ? (
                                        <>
                                            <button onClick={e => handleUpdate(e, item.product.id, item.cartId)}>+</button> {item.quantity} <button onClick={e => handleUpdate(e, item.product.id, item.cartId)}>-</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={e => handleUpdate(e, item.product.id, item.cartId)}>+</button> {item.quantity} <button onClick={e => handleDelete(e, item.product.id, item.cartId, item.product.name)}>-</button>
                                        </>
                                    )}</li>
                                    <li>Status: {item.product.status}</li>
                                    <li>Shop: {item.product.shop.name}</li>
                                    <li><button onClick={e => handleFavourite(e, item.product.id, item.cartId, item.isFavourite)}>{item.isFavourite ? "Favourite" : "Not Favourite"}</button></li>
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