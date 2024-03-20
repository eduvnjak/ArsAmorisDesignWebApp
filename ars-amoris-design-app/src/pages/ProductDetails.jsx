/* eslint-disable react/prop-types */
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import LoadingIndicator from '../components/LoadingIndicator';
import useAxios from '../api/useAxios';
import { useAuth } from '../contexts/AuthContext';

export default function ProductDetails() {
	const [
		{
			imageUrl,
			name,
			price,
			liked,
			likeCount,
			description,
			categoryName,
			categoryId,
		},
		setProduct,
	] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const { productId } = useParams();
	const heartParentRef = useRef(null);
	const likeCountRef = useRef(null);

	const axiosInstance = useAxios();
	const { isAuthenticated } = useAuth();
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

	const [relatedProducts, setRelatedProducts] = useState([]);
	useEffect(() => {
		const fetchRelatedProducts = async () => {
			if (categoryId !== undefined) {
				let result = await axiosInstance.get(
					`Products/Category/${categoryId}/Random/3`,
				);
				setRelatedProducts(
					result.data.filter(product => product.id !== productId),
				);
			}
		};
		fetchRelatedProducts();
	}, [categoryId, productId, axiosInstance]);

	async function handleHeartClick(event) {
		// neki debouncing ?
		// ovo je optimistic
		event.stopPropagation();
		if (heartParentRef.current) {
			if (isAuthenticated) {
				const endpoint = `Products/${productId}/Like`;
				// izbjegnuto koristenje state zbog problema sa prop mirroringom
				try {
					if (heartParentRef.current.getAttribute('data-liked') === 'true') {
						await axiosInstance.delete(endpoint);
						heartParentRef.current.setAttribute('data-liked', 'false');
						likeCountRef.current.textContent =
							parseInt(likeCountRef.current.textContent) - 1;
					} else {
						await axiosInstance.post(endpoint);
						heartParentRef.current.setAttribute('data-liked', 'true');
						likeCountRef.current.textContent =
							parseInt(likeCountRef.current.textContent) + 1;
					}
				} catch (error) {
					console.log(error);
				}
			} else {
				heartParentRef.current.classList.add('tooltip');
				setTimeout(() => {
					heartParentRef.current.classList.remove('tooltip');
				}, 3000);
			}
		}
	}

	return (
		<>
			{isLoading ? (
				<LoadingIndicator />
			) : (
				<div className='h-full w-full bg-white md:px-[15%] md:py-5'>
					{/* stavi da su ovo linkovi ispod */}
					<div className='px-4 py-2 font-normal text-slate-800'>
						Proizvodi &nbsp; / &nbsp;{' '}
						<span className='font-medium'>
							{categoryName ?? 'Nekategorisani'}
						</span>
					</div>
					<img src={imageUrl} alt={name + ' image'} className='' />
					<div className='mt-8 space-y-3 px-4 text-slate-800'>
						<h1 className='text-3xl font-bold'>{name}</h1>
						<div className='text-2xl font-normal'>{price} BAM</div>
						<div className='font-bold'>
							<span
								data-liked={liked}
								ref={heartParentRef}
								className='relative bottom-[2px] inline-block after:absolute after:-left-[10px] after:-z-10 after:inline-block after:whitespace-nowrap after:rounded-sm after:bg-slate-500 after:px-4 after:py-2 after:text-sm after:font-normal after:text-slate-50 after:opacity-0 after:transition-all after:duration-300 after:ease-linear after:content-["Molimo_prijavite_se"] [&.tooltip]:after:z-10 [&.tooltip]:after:-translate-y-[110%] [&.tooltip]:after:opacity-100'
								onClickCapture={handleHeartClick}
							>
								<HeartIcon />
							</span>
							<span className='px-1' ref={likeCountRef}>
								{likeCount}
							</span>
						</div>
						<p className=''>
							{description === null || description === ''
								? 'Nema opisa za ovaj proizvod'
								: description}
						</p>
					</div>
					{relatedProducts.length !== 0 && (
						<div className='mt-8'>
							<span className='px-4 font-bold'>
								Još proizvoda iz iste kategorije
							</span>
							<div className='flex flex-col'>
								{relatedProducts.map(product => (
									<RelatedProduct
										key={product.id}
										id={product.id}
										name={product.name}
										imageUrl={product.imageUrl}
										price={product.price}
									/>
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</>
	);
}

function HeartIcon() {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={2}
			className='inline-block h-6 w-6 stroke-red-600 transition duration-300 ease-in hover:cursor-pointer [[data-liked="false"]_&]:hover:fill-red-200 [[data-liked="true"]_&]:fill-red-600'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
			/>
		</svg>
	);
}

function RelatedProduct({ id, name, price, imageUrl }) {
	return (
		<div className='p-2'>
			<div className='relative mx-auto w-fit'>
				<img src={imageUrl} className='rounded-sm'></img>
				<div className='bg-grad absolute bottom-2 right-2 z-40 text-lg font-medium text-white'>
					{price} BAM
				</div>
				<div className='to-black-950/1 absolute bottom-0 z-30 h-[100px] w-full  bg-gradient-to-t from-black/85'></div>
			</div>
			<div className='mt-2 flex justify-between px-2'>
				<div className='text-sm'>{name}</div>
				<Link to={`/products/${id}`} className='text-sm font-medium'>
					Detalji
				</Link>
			</div>
		</div>
	);
}
