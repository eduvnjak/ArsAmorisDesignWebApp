import ProductCard from '../components/ProductCard.jsx';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import ProductContainer from '../components/ProductContainer.jsx';
import { createPortal } from 'react-dom';
import DeleteModal from '../components/DeleteModal.jsx';
import { useLayoutEffect, useState } from 'react';
import { useScrollbarWidth } from '../utils/useScrollbarWidth.jsx';

export async function loader(axiosInstance) {
	let result = await axiosInstance.get(`Products`);
	return result.data;
}

function PlusIcon() {
	return (
		<svg
			viewBox='0 -0.5 25 25'
			width='200px'
			height='200px'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<g id='SVGRepo_iconCarrier'>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M5.5 12.0002C5.50024 8.66068 7.85944 5.78639 11.1348 5.1351C14.4102 4.48382 17.6895 6.23693 18.9673 9.32231C20.2451 12.4077 19.1655 15.966 16.3887 17.8212C13.6119 19.6764 9.91127 19.3117 7.55 16.9502C6.23728 15.6373 5.49987 13.8568 5.5 12.0002Z'
					strokeWidth='1.5'
					strokeLinecap='round'
					strokeLinejoin='round'
					className='stroke-blue-500 transition-colors duration-300 group-hover:stroke-slate-50'
				></path>
				<path
					d='M9.875 11.2502C9.46079 11.2502 9.125 11.586 9.125 12.0002C9.125 12.4145 9.46079 12.7502 9.875 12.7502V11.2502ZM12.5 12.7502C12.9142 12.7502 13.25 12.4145 13.25 12.0002C13.25 11.586 12.9142 11.2502 12.5 11.2502V12.7502ZM12.5 11.2502C12.0858 11.2502 11.75 11.586 11.75 12.0002C11.75 12.4145 12.0858 12.7502 12.5 12.7502V11.2502ZM15.125 12.7502C15.5392 12.7502 15.875 12.4145 15.875 12.0002C15.875 11.586 15.5392 11.2502 15.125 11.2502V12.7502ZM13.25 12.0002C13.25 11.586 12.9142 11.2502 12.5 11.2502C12.0858 11.2502 11.75 11.586 11.75 12.0002H13.25ZM11.75 14.6252C11.75 15.0395 12.0858 15.3752 12.5 15.3752C12.9142 15.3752 13.25 15.0395 13.25 14.6252H11.75ZM11.75 12.0002C11.75 12.4145 12.0858 12.7502 12.5 12.7502C12.9142 12.7502 13.25 12.4145 13.25 12.0002H11.75ZM13.25 9.37524C13.25 8.96103 12.9142 8.62524 12.5 8.62524C12.0858 8.62524 11.75 8.96103 11.75 9.37524H13.25ZM9.875 12.7502H12.5V11.2502H9.875V12.7502ZM12.5 12.7502H15.125V11.2502H12.5V12.7502ZM11.75 12.0002V14.6252H13.25V12.0002H11.75ZM13.25 12.0002V9.37524H11.75V12.0002H13.25Z'
					className='fill-blue-500 transition-colors duration-300 group-hover:fill-slate-50'
				></path>
			</g>
		</svg>
	);
}

export default function ManageProducts() {
	const [showModal, setShowModal] = useState(false);
	const [modalData, setModalData] = useState({ id: undefined, name: '' }); // ima li pametniji nacin da se ovo odradi
	const products = useLoaderData();

	const navigate = useNavigate();
	const scrollbarWidth = useScrollbarWidth();

	// ovo je moglo i bez effecta, postavljati i uklanjati u event handlerima
	// da li treba layout effect ili obicni ?
	useLayoutEffect(() => {
		if (showModal) {
			document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
			document.documentElement.style.backgroundColor = 'ghostwhite';
		} else {
			document.documentElement.style.paddingRight = 0;
		}
	}, [showModal, scrollbarWidth]);

	function deleteHandler(productId) {
		console.log('delete ' + productId);
		// ovdje ono da li ste sigurni
		setShowModal(false);
	}

	return (
		<>
			<h1 className='py-3 text-center text-4xl font-medium text-white'>
				Upravljanje proizvodima
			</h1>
			<ProductContainer>
				<div
					className='group m-2 flex cursor-pointer items-center justify-center rounded border-8 border-slate-50  bg-slate-50 shadow-2xl transition-all duration-300 hover:border-8  hover:bg-gradient-to-r hover:from-blue-300 hover:to-blue-600'
					onClick={() => navigate('new')}
				>
					<PlusIcon />
				</div>
				{products.map(product => (
					<ProductCard key={product.id} product={product}>
						<Button onClick={() => navigate(`${product.id}`)}>
							Izmijeni <span className='sm:hidden'>proizvod ✏️</span>
						</Button>
						<Button
							onClick={() => {
								setModalData({ id: product.id, name: product.name });
								setShowModal(true);
							}}
						>
							Obriši <span className='sm:hidden'>proizvod ❌</span>
						</Button>
					</ProductCard>
				))}
			</ProductContainer>
			{showModal &&
				createPortal(
					<DeleteModal
						name={modalData.name}
						confirmOnClick={() => deleteHandler(modalData.id)}
						declineOnClick={() => setShowModal(false)}
					/>,
					document.getElementById('root'),
				)}
		</>
	);
}
