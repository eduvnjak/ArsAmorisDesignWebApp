import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function FeaturedProducts() {
	const [products, setProducts] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchProducts = async () => {
			let result = await axios.get('https://localhost:7196/api/Products');
			setProducts(result.data);
		};
		fetchProducts();
	}, []);

	return (
		<>
			<h1 className='text-center text-white py-3 font-medium text-4xl'>Izdvojeni proizvodi</h1>
			<div className='flex flex-row flex-wrap px-2'>
				{products.map(product => (
					<ProductCard
						key={product.id}
						name={product.name}
						price={product.price}
						imageUrl={product.imageUrl}
						showDetails={() => {
							navigate(`products/${product.id}`);
						}}
					/>
				))}
			</div>
		</>
	);
}
