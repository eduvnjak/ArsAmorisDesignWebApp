import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductDetails() {
	const [product, setProduct] = useState(null);
    const [isLoading, setLoading] = useState(true);
	const { productId } = useParams();

	useEffect(() => {
		const fetchProduct = async () => {
			let result = await axios.get(`https://localhost:7196/api/Products/${productId}`);
            setProduct(result.data);
		};
		fetchProduct();
	}, []);

	return (
        product &&
		<div className='mx-8 mt-8 min-h-fit rounded-xl bg-white'>
			<h1 className='text-center text-red-500 py-3 font-medium text-4xl'>{product.name}</h1>
			<img src={product.filePath} alt={product.name + " image"} className="m-5 float-left w-96"/>
            <p className='top-4 right-4 text-2xl'>{(product.description=== null || product.description === '') ? "Nema opisa za ovaj proizvod" : product.description}</p>
            <div className="font-medium font">Cijena: {product.price}</div>
            <div className="clear-both"></div>
		</div>
	);
}