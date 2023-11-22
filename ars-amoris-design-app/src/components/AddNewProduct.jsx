import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from './LoadingIndicator';
import Button from './Button';

export default function AddNewProduct() {
	const [product, setProduct] = useState({ name: '', description: '', price: '' });
	const [image, setImage] = useState(null);
	const [isLoading, setLoading] = useState(false);
	const navigate = useNavigate();

	// effect da revoke object url
	async function handleAddProduct() {
		if (product.name == '' || product.price == '' || image === null) {
			//ovo sredi
			console.log('propala validacija');
			return;
		}

		const data = new FormData();
		data.append('Name', product.name);
		data.append('Price', product.price.slice().replace('.', ',')); // pazi na decimalni
		data.append('Description', product.description);
		data.append('Image', image);

		try {
			let response = await axios.post(`https://localhost:7196/api/Products/`, data);
			navigate('/manage-products');
		} catch (error) {
			console.log(error.message); // prikazi neku gresku
		}
	}

	return (
		<>
			{isLoading ? (
				<LoadingIndicator />
			) : (
				<div className='mx-8 mt-8 min-h-fit rounded-xl bg-white'>
					<img
						src={image ? URL.createObjectURL(image) : 'https://fakeimg.pl/800x450?text=Image+preview&font=noto'}
						alt={product.name + ' image'}
						className='m-5 float-left w-96'
					/>
					<label>
						Naziv proizvoda:{' '}
						<input
							type='text'
							value={product.name}
							onChange={e => {
								setProduct({ ...product, name: e.target.value });
							}}
							className='transition-all duration-300 my-3 shadow-md focus:outline-none focus:ring focus:ring-blue-600'
						></input>
					</label>{' '}
					<br />
					<label>
						Opis proizvoda:{' '}
						<input
							type='text'
							value={product.description}
							onChange={e => {
								setProduct({ ...product, description: e.target.value });
							}}
							className='transition-all duration-300 my-3 shadow-md focus:outline-none focus:ring focus:ring-blue-600'
						></input>
					</label>{' '}
					<br />
					<label>
						Cijena:{' '}
						<input
							type='number'
							value={product.price}
							onChange={e => {
								setProduct({ ...product, price: e.target.value });
							}}
							className='transition-all duration-300 my-3 shadow-md focus:outline-none focus:ring focus:ring-blue-600'
							step={0.01}
						></input>
					</label>{' '}
					<br />
					<label>
						Nova slika:{' '}
						<input
							type='file'
							accept='image/png, image/jpeg'
							onChange={e => setImage(e.target.files[0] ?? null)}
						></input>
					</label>{' '}
					<br />
					<div className='p-3'>
						<Button onClick={handleAddProduct}>Dodaj novi proizvod</Button>
					</div>
					<div className='clear-both'></div>
				</div>
			)}
		</>
	);
}
