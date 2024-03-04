import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import axios from 'axios';
import { Await, defer, useLoaderData, useNavigate } from 'react-router-dom';
import ProductContainer from '../components/ProductContainer';
import { Suspense } from 'react';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

export async function loader() {
	const productsPromise = axios.get(
		`${import.meta.env.VITE_API_URL}Products/Featured`,
	);
	return defer({ products: productsPromise.then(res => res.data) });
}

export default function FeaturedProducts() {
	const loaderData = useLoaderData();

	const navigate = useNavigate();

	return (
		<>
			<h1 className='py-3 text-center text-4xl font-medium text-white'>
				Izdvojeni proizvodi
			</h1>
			<ProductContainer>
				<Suspense
					fallback={
						<>
							{Array.from({ length: 20 }, (v, i) => (
								<ProductCardSkeleton key={i} />
							))}
						</>
					}
				>
					<Await
						resolve={loaderData.products}
						errorElement={<p>Error loading data</p>}
					>
						{products => (
							<>
								{products.map(product => (
									<ProductCard key={product.id} product={product}>
										<Button
											onClick={() => {
												navigate(`products/${product.id}`);
											}}
										>
											Pogledaj detalje
										</Button>
									</ProductCard>
								))}
							</>
						)}
					</Await>
				</Suspense>
			</ProductContainer>
		</>
	);
}
