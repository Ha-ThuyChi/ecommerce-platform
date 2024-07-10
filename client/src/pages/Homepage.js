import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import config from "../config";
import Modal from "react-modal";

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
        return result;
    } catch (error) {
        console.error("Error while fetching user: ", error.message);
    }
}

export function Homepage() {
    const token = localStorage.getItem("token");
    const [products, setProducts] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const userId = localStorage.getItem("userId");
    const [modelIsOpen, setModalIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    useEffect(() => {
        fetchProducts(pageNum, setProducts, token)
    }, [pageNum, token]);

    async function handleAddToCart(e, productId) {
        e.preventDefault();
        const response = await addItemToCart(token, {
            userId,
            productId,
            quantity
        });
        if (response.success) {
            alert(response.message);
            window.location.href = "/view-cart"
        } else {
            alert(`${response.message}`);
        }
    };
    function openModal(product) {
        setSelectedProduct(product);
        setModalIsOpen(true);
    };
    function closeModal() {
        setModalIsOpen(false);
        setSelectedProduct(null);
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
                                    <img src={product.image} alt={`${product.name}`} width={500}/>
                                </li>
                                <li>Description: {product.description}</li>
                                <li>Price: {product.price}</li>
                                <li>Status: {product.status}</li>
                                <li>Available stock: {product.quantity}</li>
                                <li>Shop: {product.shop.name}</li>
                                {product.quantity > 0 ? (
                                    <button onClick={() => openModal(product)}>Add to cart</button>
                                ) : (
                                    <button onClick={() => openModal(product)} disabled>Add to cart</button>
                                )}
                            </ul>
                        </div>
                    )
                })
            ) : (
                <p>No product to view.</p>
            )}
            <label htmlFor="page">Page: </label>
            <input type="number" name="page" value={pageNum} onChange={e => setPageNum(e.target.value)}></input>
            {selectedProduct !== null && 
                <Modal 
                    isOpen={modelIsOpen} 
                    onRequestClose={closeModal}
                    style={customStyles}
                    ariaHideApp={false}
                >
                    <p>Name: {selectedProduct.name}</p>
                    <p>Price: {selectedProduct.price}</p>
                    <label htmlFor="quantity">Quantity:</label><br/>
                    <input type="number" name="quantity" value={quantity} min={1} onChange={e => setQuantity(e.target.value)}></input><br/>
                    <button onClick={e => handleAddToCart(e, selectedProduct.id)}>Add</button>
                </Modal>
            }
        </div>
    )
}