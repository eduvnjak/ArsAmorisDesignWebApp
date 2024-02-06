import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import axios from 'axios';
import { useLoaderData, useNavigate } from 'react-router-dom';
import ProductContainer from '../components/ProductContainer';

export async function loader() {
	let result = await axios.get(
		`${import.meta.env.VITE_API_URL}Products/Featured`,
	);
	return result.data;
}

export default function FeaturedProducts() {
	const products = useLoaderData();

	const navigate = useNavigate();

	return (
		<>
			<h1 className='py-3 text-center text-4xl font-medium text-white'>
				Izdvojeni proizvodi
			</h1>
			<ProductContainer>
				{products.map(product => (
					<ProductCard
						key={product.id}
						name={product.name}
						price={product.price}
						imageUrl={product.imageUrl}
						categoryName={product.categoryName}
					>
						<Button
							onClick={() => {
								navigate(`products/${product.id}`);
							}}
						>
							Pogledaj detalje
						</Button>
					</ProductCard>
				))}
			</ProductContainer>
		</>
	);
}
