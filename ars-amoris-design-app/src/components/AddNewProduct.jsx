import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

export default function AddNewProduct() {
	const [product, setProduct] = useState({ name: '', description: '', price: '', categoryId: null });
	const [image, setImage] = useState(null);
	const [productCategories, setProductCategories] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchProductCategories = async () => {
			let result = await axios.get(`https://localhost:7196/api/ProductCategories`);
			setProductCategories(result.data);
		};
		fetchProductCategories();
	}, []);
	// effect da revoke object url
	async function handleAddProduct() {
		if (product.name == '' || product.price == '' || image === null) {
			//ovo sredi
			console.log('propala validacija');
			return;
		}

		const data = new FormData();
		data.append('Name', product.name);
		data.append('Price', Number(product.price));
		data.append('Description', product.description);
		data.append('Image', image);
		data.append('Featured', product.featured); // osposobi mijenjanje
		if (product.categoryId !== null && product.categoryId !== 'null') {
			data.append('ProductCategoryId', product.categoryId);
		}

		try {
			await axios.post(`https://localhost:7196/api/Products/`, data);
			navigate('/manage-products');
		} catch (error) {
			console.log(error.message); // prikazi neku gresku
		}
	}

	return (
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
						setProduct({ ...product, price: Number(e.target.value) });
					}}
					className='transition-all duration-300 my-3 shadow-md focus:outline-none focus:ring focus:ring-blue-600'
					step={0.01}
				></input>
			</label>{' '}
			<br />
			<label>
				Kategorija:{' '}
				<select
					onChange={e => {
						setProduct({ ...product, categoryId: e.target.value });
					}}
					value={product.categoryId ?? 'null'}
					className='transition-all duration-300 p-1 shadow-md focus:outline-none focus:ring focus:ring-blue-600'
				>
					<option value='null'>Bez kategorije</option>
					{productCategories.map(pc => (
						<option key={pc.id} value={pc.id}>
							{pc.name}
						</option>
					))}
				</select>
			</label>{' '}
			<br />
			<label>
				Nova slika:{' '}
				<input
					type='file'
					accept='image/png, image/jpeg'
					className='file:transition-colors file:mt-2 file:cursor-pointer
						 file:duration-300 file:hover:border-blue-500 file:hover:border-solid file:hover:border-4
						  file:hover:p-3 file:p-4 file:font-medium file:hover:from-white
						   file:hover:to-white file:hover:text-blue-500 file:text-white
						    file:bg-gradient-to-l file:from-blue-400 file:to-blue-500
							 file:shadow-md file:rounded-full file:border-0 file:border-blue-500'
					onChange={e => setImage(e.target.files[0] ?? null)}
				></input>
			</label>{' '}
			<br />
			<div className='p-3'>
				<Button onClick={handleAddProduct}>Dodaj novi proizvod</Button>
			</div>
			<div className='p-3'>
				<Button onClick={() => navigate('/manage-products')}>Odustani</Button>
			</div>
			<div className='clear-both'></div>
		</div>
	);
}
