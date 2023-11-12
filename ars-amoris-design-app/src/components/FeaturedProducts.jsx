import ProductCard from './ProductCard';
import axios from 'axios';
import { useLoaderData, useNavigate } from 'react-router-dom';

export async function loader() {
	let result = await axios.get('https://localhost:7196/api/Products');
	return result.data;
}

export default function FeaturedProducts() {
	const products = useLoaderData();

	const navigate = useNavigate();

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
