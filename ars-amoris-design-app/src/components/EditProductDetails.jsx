import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EditProductDetails() {
	const [product, setProduct] = useState(null);
	const [newImage, setNewImage] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const { productId } = useParams();
    const navigate = useNavigate();


	// da li fetch kroz api ili primiti objekat kroz properties
	useEffect(() => {
		const fetchProduct = async () => {
			setLoading(true);
			let result = await axios.get(`https://localhost:7196/api/Products/${productId}`);
			setProduct(result.data);
			setLoading(false);
		};
		fetchProduct();
	}, []); // treba li ovdje neki cleanup

	// effect da revoke object url
	async function handleProductUpdate() {
		if (product.name == '' || product.price == '') {
			//ovo sredi
			console.log('propala validacija');
			return;
		}

		const data = new FormData();
		data.append('Name', product.name);
		data.append('Price', product.price); // pazi na decimalni
		data.append('Description', product.description);
		data.append('Image', newImage);

        try {
            let response = await axios.put(`https://localhost:7196/api/Products/${productId}`, data);
            navigate('/manage-products');
        } catch (error) {
            console.log(error.message); // prikazi neku gresku
        }
	}

	return (
		<>
			{isLoading ? (
				<h1 className='text-white text-2xl text-center'>Loading...</h1> // mozda ovakvu komponentu
			) : (
				<div className='mx-8 mt-8 min-h-fit rounded-xl bg-white'>
					<img
						src={newImage ? URL.createObjectURL(newImage) : product.imageUrl}
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
							className='transition-all duration-300 my-3 shadow-md focus:outline-none focus:ring focus:ring-red-600'
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
							className='transition-all duration-300 my-3 shadow-md focus:outline-none focus:ring focus:ring-red-600'
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
							className='transition-all duration-300 my-3 shadow-md focus:outline-none focus:ring focus:ring-red-600'
						></input>
					</label>{' '}
					<br />
					<label>
						Nova slika:{' '}
						<input type='file' accept='image/png, image/jpeg' onChange={e => setNewImage(e.target.files[0])}></input>
					</label>{' '}
					<br />
					<button
						className='mt-3 transition-colors duration-300 hover:border-red-500 hover:border-4 hover:p-3 mx-auto p-4 font-medium hover:from-white hover:to-white hover:text-red-500 text-white bg-gradient-to-l from-red-400 to-red-500 shadow-md rounded-full border-0'
						onClick={handleProductUpdate}
					>
						Potvrdi izmjene
					</button>
					<div className='clear-both'></div>
				</div>
			)}
		</>
	);
}
