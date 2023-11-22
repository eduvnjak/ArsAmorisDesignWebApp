import ManageProductCard from './ManageProductCard.jsx';
import axios from 'axios';
import { useLoaderData, useNavigate } from 'react-router-dom';

export async function loader() {
	let result = await axios.get('https://localhost:7196/api/Products');
	return result.data;
}

export default function ManageProducts() {
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
					onClick={()=> navigate('new')}
				>
					<div>➕</div>
				</div>
				{products.map(product => (
					<ManageProductCard
						key={product.id}
						name={product.name}
						price={product.price}
						imageUrl={product.imageUrl}
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
