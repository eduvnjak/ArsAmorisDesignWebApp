import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import ProductContainer from '../components/ProductContainer';
import { useState } from 'react';

const data = [
	{
		id: '788696c6-3d72-4f08-7b54-08dbeb8b0133',
		name: 'jos jedan test',
		price: 0.03,
		description: 'gori vatra',
		imageUrl: 'https://localhost:7196/Images/x0101axz-rah.jpg',
		categoryId: '75c59ced-8d66-11ee-8d1b-3065ec946484',
		categoryName: 'Kategorija B',
		featured: true,
		likeCount: 15,
		liked: false,
		thumbnailUrl:
			'https://localhost:7196/Images/thumbnails/x0101axz-rah_tb.jpg',
	},
	{
		id: '4ae94d47-8adf-11ee-863a-3065ec946484',
		name: 'Dodatni 3',
		price: 9.0,
		description: 'test proizvoda update',
		imageUrl: 'https://localhost:7196/Images/slika1.png',
		categoryId: '75c5d728-8d66-11ee-8d1b-3065ec946484',
		categoryName: 'Kategorija C',
		featured: true,
		likeCount: 18,
		liked: false,
		thumbnailUrl: 'https://localhost:7196/Images/thumbnails/slika1_tb.png',
	},
	{
		id: '0b7d15c5-e252-445e-a01c-08dbf58f8e2e',
		name: 'Novi izdvojeni',
		price: 100.0,
		description: 'novi izdvojeni',
		imageUrl: 'https://localhost:7196/Images/dk1gr3in-war.png',
		categoryId: null,
		categoryName: null,
		featured: true,
		likeCount: 6,
		liked: false,
		thumbnailUrl: 'https://localhost:7196/Images/dk1gr3in-war.png',
	},
	{
		id: '81dafe6e-0632-43d8-a01e-08dbf58f8e2e',
		name: 'test nova kategorija',
		price: 1.01,
		description: 'test nova kat',
		imageUrl: 'https://localhost:7196/Images/2vmq4c03-lnf.png',
		categoryId: '2d9e931a-d772-4769-c258-08dbf5967eff',
		categoryName: 'kategorija nova',
		featured: true,
		likeCount: 12,
		liked: false,
		thumbnailUrl: 'https://localhost:7196/Images/2vmq4c03-lnf.png',
	},
	{
		id: 'ed2b5682-e7ce-4c82-983f-08dc16b0c56d',
		name: 'auth test',
		price: 101.0,
		description: 'auth test',
		imageUrl: 'https://localhost:7196/Images/5thpnah2-yrc.jpg',
		categoryId: null,
		categoryName: null,
		featured: true,
		likeCount: 16,
		liked: false,
		thumbnailUrl:
			'https://localhost:7196/Images/thumbnails/5thpnah2-yrc_tb.jpg',
	},
	{
		id: 'aae38655-1cc8-463a-9840-08dc16b0c56d',
		name: 'auth test 2',
		price: 102.0,
		description: 'auth test 2',
		imageUrl: 'https://localhost:7196/Images/zojlxwfa-dtt.jpg',
		categoryId: '0e4eaba7-785a-44a6-35ac-08dc16b02ed2',
		categoryName: 'auth test 2',
		featured: true,
		likeCount: 10,
		liked: false,
		thumbnailUrl:
			'https://localhost:7196/Images/thumbnails/zojlxwfa-dtt_tb.jpg',
	},
	{
		id: 'a22d79e6-d929-4f4f-c9dc-08dc18615529',
		name: 'test ref',
		price: 0.05,
		description: 'test ref',
		imageUrl: 'https://localhost:7196/Images/acrm3aec-xtn.jpg',
		categoryId: '8840e368-2a6d-4839-ea05-08dc18613297',
		categoryName: 'ref test',
		featured: true,
		likeCount: 13,
		liked: false,
		thumbnailUrl:
			'https://localhost:7196/Images/thumbnails/acrm3aec-xtn_tb.jpg',
	},
	{
		id: '755e02ac-2116-4fcb-8dfc-08dc1c0fb283',
		name: 'build test',
		price: 15.0,
		description: 'build test',
		imageUrl: 'https://localhost:7196/Images/o4xo3na3-5hp.jpg',
		categoryId: '0e4eaba7-785a-44a6-35ac-08dc16b02ed2',
		categoryName: 'auth test 2',
		featured: true,
		likeCount: 21,
		liked: false,
		thumbnailUrl:
			'https://localhost:7196/Images/thumbnails/o4xo3na3-5hp_tb.jpg',
	},
	{
		id: '691faf4b-b085-4816-8055-08dc1db0f974',
		name: 'ne localhost',
		price: 99.99,
		description: 'null',
		imageUrl: 'https://localhost:7196/Images/xdzuh0f3-wip.jpg',
		categoryId: null,
		categoryName: null,
		featured: true,
		likeCount: 18,
		liked: false,
		thumbnailUrl:
			'https://localhost:7196/Images/thumbnails/xdzuh0f3-wip_tb.jpg',
	},
];

export default function ReorderingTest() {
	const [products, setProducts] = useState(data);

	const navigate = useNavigate();
	const [isReordering, setIsReordering] = useState(false);

	function handleDragStart(event, currentIndex) {
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('text/plain', currentIndex);
		console.log(`Dragging ${currentIndex}`);
	}
	function move(sourceIndex, targetIndex) {
		console.log(`Dropped on ${targetIndex}`);
		if (sourceIndex == targetIndex) return false;
		const sourceElement = products[sourceIndex];
		setProducts(products => products.toSpliced(sourceIndex, 1));
		setProducts(products => products.toSpliced(targetIndex, 0, sourceElement));
	}
	function handleDrop(event, targetIndex) {
		event.stopPropagation();
		//move(event.dataTransfer.getData('text/plain'), targetIndex);
		return false;
	}
	function handleDragOver(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}
		// move(e.dataTransfer.getData('text/plain'), targetIndex);
		return false;
	}
	function handleDragEnter(e, targetIndex) {
		console.log(
			`Dragging ${e.dataTransfer.getData('text/plain')} over ${targetIndex}`,
		);
		//move(e.dataTransfer.getData('text/plain'), targetIndex);
	}

	return (
		<>
			<div className='grid grid-cols-3 px-2 py-3 '>
				<h1 className='col-start-2 text-center text-4xl font-medium text-white'>
					Test reordering
				</h1>

				<ButtonNormal onClick={() => setIsReordering(!isReordering)}>
					{isReordering ? 'Cancel' : 'Reorder'}
				</ButtonNormal>
			</div>
			<ProductContainer>
				{products.map((product, index) => (
					<ProductCard
						key={product.id}
						product={product}
						draggable={isReordering}
						currentIndex={index}
						{...(isReordering && {
							handleDragStart: e => handleDragStart(e, index),
						})}
						{...(isReordering && {
							handleDrop: e => handleDrop(e, index),
						})}
						{...(isReordering && {
							handleDragOver,
						})}
						{...(isReordering && {
							handleDragEnter: e => handleDragEnter(e, index),
						})}
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

/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import useAxios from '../api/useAxios';
import { useAuth } from '../contexts/AuthContext';

function ProductCard({
	children,
	product,
	draggable,
	handleDragStart,
	handleDrop,
	handleDragOver,
	handleDragEnter,
}) {
	const { id, name, price, imageUrl, categoryName, likeCount, liked } = product;
	// if (liked != isLiked) setIsLiked(liked); // mirroring prop in state - oprez ! ovo je zeznuto totalno
	const nameRef = useRef(null);
	const heartParentRef = useRef(null);
	const likeCountRef = useRef(null);

	const axiosInstance = useAxios();
	const { isAuthenticated } = useAuth();

	useEffect(() => {
		if (nameRef.current !== null && nameRef.current.scrollWidth > 296) {
			nameRef.current.classList.add('name-tooltip');
		}
	}, []);

	async function handleHeartClick(event) {
		// neki debouncing ?
		// ovo je optimistic
		event.stopPropagation();
		if (heartParentRef.current) {
			if (isAuthenticated) {
				const endpoint = `Products/${id}/Like`;
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

	const duration = Math.random() * 500 + 300;
	const angle = Math.random() * 6 - 3;
	return (
		<div
			className='m-2 flex animate-pop-in flex-col rounded bg-slate-50 p-0.5 shadow-2xl transition-all duration-200 sm:flex-row'
			draggable={draggable}
			style={
				!draggable
					? {
							animationDuration: `${duration}ms`,
							animationFillMode: 'backwards',
						}
					: {
							transform: 'scale(0.9)',
							rotate: `${angle}deg`,
						}
			}
			onDragStart={handleDragStart}
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			onDragEnter={throttle(handleDragEnter, 2000)}
		>
			<div className='h-64 shrink-0 sm:w-64'>
				<img
					src={imageUrl}
					alt={name + ' image'}
					className='h-full w-full rounded object-cover'
				/>
			</div>
			<div className='relative flex grow flex-col justify-end gap-3 p-6'>
				<h2
					ref={nameRef}
					data-tooltip={name}
					className='text-2xl font-bold text-slate-800 sm:w-[296px] 
					sm:truncate sm:after:absolute sm:after:right-[50%] sm:after:-translate-y-[100%] sm:after:translate-x-[50%] sm:after:rounded-sm
					sm:after:bg-slate-500 sm:after:px-4 sm:after:py-2 sm:after:text-sm sm:after:font-normal sm:after:text-slate-50 
					sm:after:opacity-0 sm:after:transition sm:after:duration-200 sm:after:content-[attr(data-tooltip)] [&.name-tooltip]:sm:hover:after:opacity-100'
				>
					{name}
				</h2>
				<div className='flex items-baseline justify-between px-2 sm:flex-col'>
					<span>{categoryName ?? 'Nekategorisan'}</span>
					<span className='text-lg font-bold'>{price} BAM</span>
				</div>
				<span className='px-2 font-bold'>
					<span
						data-liked={liked}
						ref={heartParentRef}
						className='relative inline-block after:absolute after:left-[50%] after:-z-10 after:inline-block after:-translate-x-[50%] after:whitespace-nowrap after:rounded-sm after:bg-slate-500 after:px-4 after:py-2 after:text-sm after:font-normal after:text-slate-50 after:opacity-0 after:transition-all after:duration-300 after:ease-linear after:content-["Molimo_prijavite_se"] [&.tooltip]:after:z-10 [&.tooltip]:after:-translate-y-[110%] [&.tooltip]:after:opacity-100'
						onClickCapture={handleHeartClick}
					>
						<HeartIcon />
					</span>
					<span ref={likeCountRef} className='px-1'>
						{likeCount}
					</span>
				</span>
				<div className='flex flex-col gap-4 sm:flex-row'>{children}</div>
			</div>
		</div>
	);
}

function HeartIcon() {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={2}
			className='inline-block h-6 w-6 stroke-red-600 transition duration-300 ease-in hover:cursor-pointer [[data-liked="false"]_&]:fill-slate-50 [[data-liked="false"]_&]:hover:fill-red-200 [[data-liked="true"]_&]:fill-red-600'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
			/>
		</svg>
	);
}
function throttle(func, duration) {
	let shouldWait = false;

	return function (...args) {
		if (!shouldWait) {
			func.apply(this, args);
			shouldWait = true;

			setTimeout(function () {
				shouldWait = false;
			}, duration);
		}
	};
}

// izgleda da mi treba twmerge ili clsx ili cn sta vec
export function ButtonNormal({ children, type = 'button', ...rest }) {
	return (
		<button
			className='ml-auto rounded border-0 bg-slate-50 p-4 font-medium text-blue-500 shadow-md transition-colors duration-300 hover:border-4  hover:border-red-500 hover:p-3'
			type={type}
			{...rest}
		>
			{children}
		</button>
	);
}
