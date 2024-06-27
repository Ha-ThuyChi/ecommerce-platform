import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import config from "../config";

async function fetchProducts(pageNum, setProducts, token) {
    try {
        const response = await fetch(config.serverLink + `/api/product/get-products/${pageNum}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            console.error("error:", response.status);
        };
        const result = await response.json();
        setProducts(result.message);
    } catch (error) {
        console.error("Error while fetching products: ", error.message);
    }
}

export function Homepage() {
    const token = localStorage.getItem("token");
    const [products, setProducts] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    
    useEffect(() => {
        fetchProducts(pageNum, setProducts, token)
    }, [pageNum, token]);

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