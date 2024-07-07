import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import config from "../config";
import Popup from "reactjs-popup";

async function fetchProducts(pageNum, setProducts) {
    try {
        const response = await fetch(config.serverLink + `/api/product/get-products/${pageNum}`, {
            method: "GET",
        });
        if (!response.ok) {
            console.error("error:", response.status);
        };
        const result = await response.json();
        setProducts(result.message);
    } catch (error) {
        console.error("Error while fetching products: ", error.message);
    }
};

async function addItemToCart(token, values) {
    console.log("create order")
    try {
        const response = await fetch(config.serverLink + `/api/cart/add-item`, {
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

export function Homepage() {
    const token = localStorage.getItem("token");
    const [products, setProducts] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [showAddToCart, setShowAddToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const userId = localStorage.getItem("userId")

    useEffect(() => {
        fetchProducts(pageNum, setProducts, token)
    }, [pageNum, token]);

    async function handleShowAddToCart(e) {
        e.preventDefault();
        setShowAddToCart(true);
    };
    async function handleAddToCart(e, productId) {
        e.preventDefault();
        const response = await addItemToCart(token, {
            userId,
            productId,
            quantity
        });
        console.log(response)
        if (response.success) {
            alert(response.message);
        } else {
            alert(`${response.message}`);
        }
    };
    return (
        <div>
            <NavBar/>
            <h1>Homepage</h1>
            {products.length > 0 ? (
                products.map((product) => {
                    return(
                        <div>
                            <ul>
                                <li>Name: {product.name}</li>
                                <li>Image:<br/>
                                    <img src={product.image} alt="Image" width={500}/>
                                </li>
                                <li>Description: {product.description}</li>
                                <li>Price: {product.price}</li>
                                <li>Status: {product.status}</li>
                                <li>Shop: {product.shop.name}</li>
                                <button onClick={handleShowAddToCart}>Add to cart</button>
                                {showAddToCart && 
                                    <div>
                                        <label htmlFor="quantity">Quantity:</label><br/>
                                        <input type="number" name="quantity" value={quantity} min={1} onChange={e => setQuantity(e.target.value)}></input><br/>
                                        <button onClick={e => handleAddToCart(e, product.id)}>Add</button>
                                    </div>
                                }
                            </ul>
                        </div>
                    )
                })
            ) : (
                <p>No product to view.</p>
            )}
            <label htmlFor="page">Page: </label>
            <input type="number" name="page" value={pageNum} onChange={e => setPageNum(e.target.value)}></input>
            
        </div>
    )
}