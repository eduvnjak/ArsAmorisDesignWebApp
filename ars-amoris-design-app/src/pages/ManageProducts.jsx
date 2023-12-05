import ManageProductCard from '../components/ManageProductCard.jsx';
import axios from 'axios';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export async function loader() {
	let result = await axios.get('https://localhost:7196/api/Products');
	return result.data;
}

export default function ManageProducts() {
	const [isAddButtonHovered, setIsAddButtonHovered] = useState(false);
	const products = useLoaderData();

	const navigate = useNavigate();

	function deleteHandler(productId) {
		console.log('delete ' + productId);
		// ovdje ono da li ste sigurni
	}

	return (
		<>
			<h1 className='text-center text-white py-3 font-medium text-4xl'>Upravljanje proizvodima</h1>
			<div className='flex flex-row flex-wrap px-2'>
				<div
					className='box-content hover:box-content cursor-pointer m-2 hover:border-slate-50 hover:border-8 hover:p-0 bg-slate-50 rounded-xl p-3 shadow-2xl text-9xl flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-300 hover:to-blue-600 border-0 duration-300 transition-all'
					style={{ width: 364.641, height: 312 }}
					onClick={() => navigate('new')}
					onMouseEnter={() => setIsAddButtonHovered(true)}
					onMouseLeave={() => setIsAddButtonHovered(false)}
				>
					<svg viewBox='0 -0.5 25 25' width='200px' height='200px' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<g id='SVGRepo_iconCarrier'>
							<path
								fillRule='evenodd'
								clipRule='evenodd'
								d='M5.5 12.0002C5.50024 8.66068 7.85944 5.78639 11.1348 5.1351C14.4102 4.48382 17.6895 6.23693 18.9673 9.32231C20.2451 12.4077 19.1655 15.966 16.3887 17.8212C13.6119 19.6764 9.91127 19.3117 7.55 16.9502C6.23728 15.6373 5.49987 13.8568 5.5 12.0002Z'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
								className={`${
									isAddButtonHovered ? 'stroke-slate-50' : 'stroke-blue-500'
								} transition-colors duration-300`}
							></path>
							<path
								d='M9.875 11.2502C9.46079 11.2502 9.125 11.586 9.125 12.0002C9.125 12.4145 9.46079 12.7502 9.875 12.7502V11.2502ZM12.5 12.7502C12.9142 12.7502 13.25 12.4145 13.25 12.0002C13.25 11.586 12.9142 11.2502 12.5 11.2502V12.7502ZM12.5 11.2502C12.0858 11.2502 11.75 11.586 11.75 12.0002C11.75 12.4145 12.0858 12.7502 12.5 12.7502V11.2502ZM15.125 12.7502C15.5392 12.7502 15.875 12.4145 15.875 12.0002C15.875 11.586 15.5392 11.2502 15.125 11.2502V12.7502ZM13.25 12.0002C13.25 11.586 12.9142 11.2502 12.5 11.2502C12.0858 11.2502 11.75 11.586 11.75 12.0002H13.25ZM11.75 14.6252C11.75 15.0395 12.0858 15.3752 12.5 15.3752C12.9142 15.3752 13.25 15.0395 13.25 14.6252H11.75ZM11.75 12.0002C11.75 12.4145 12.0858 12.7502 12.5 12.7502C12.9142 12.7502 13.25 12.4145 13.25 12.0002H11.75ZM13.25 9.37524C13.25 8.96103 12.9142 8.62524 12.5 8.62524C12.0858 8.62524 11.75 8.96103 11.75 9.37524H13.25ZM9.875 12.7502H12.5V11.2502H9.875V12.7502ZM12.5 12.7502H15.125V11.2502H12.5V12.7502ZM11.75 12.0002V14.6252H13.25V12.0002H11.75ZM13.25 12.0002V9.37524H11.75V12.0002H13.25Z'
								className={`${isAddButtonHovered ? 'fill-slate-50' : 'fill-blue-500'} transition-colors duration-300`}
							></path>
						</g>
					</svg>
				</div>
				{products.map(product => (
					<ManageProductCard
						key={product.id}
						name={product.name}
						price={product.price}
						imageUrl={product.imageUrl}
						categoryName={product.categoryName}
						editDetailsHandler={() => {
							navigate(`${product.id}`);
						}}
						deleteHandler={() => deleteHandler(product.id)}
					/>
				))}
			</div>
		</>
	);
}