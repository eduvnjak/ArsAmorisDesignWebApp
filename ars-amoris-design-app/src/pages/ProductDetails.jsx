import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoadingIndicator from '../components/LoadingIndicator';
import useAxios from '../api/useAxios';

export default function ProductDetails() {
	const [product, setProduct] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const { productId } = useParams();

	const axiosInstance = useAxios();
	// da li fetch kroz api ili primiti objekat kroz properties
	useEffect(() => {
		const fetchProduct = async () => {
			setIsLoading(true);
			let result = await axiosInstance.get(`Products/${productId}`);
			setProduct(result.data);
			setIsLoading(false);
		};
		fetchProduct();
	}, [productId, axiosInstance]);

	return (
		<>
			{isLoading ? (
				<LoadingIndicator />
			) : (
				<div className='mx-8 mt-8 min-h-fit rounded-xl bg-white'>
					<h1 className='py-3 text-center text-4xl font-medium text-blue-500'>
						{product.name}
					</h1>
					<img
						src={product.imageUrl}
						alt={product.name + ' image'}
						className='float-left m-5 w-96'
					/>
					<p className='right-4 top-4 text-2xl'>
						{product.description === null || product.description === ''
							? 'Nema opisa za ovaj proizvod'
							: product.description}
					</p>
					<div className='font-medium'>Cijena: {product.price}</div>
					<div className='font-medium'>
						{product.categoryName ?? 'Nekategorisan'}
					</div>
					<div className='clear-both'></div>
				</div>
			)}
		</>
	);
}
