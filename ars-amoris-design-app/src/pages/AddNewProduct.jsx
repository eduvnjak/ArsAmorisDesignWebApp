import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import StyledInput from '../components/StyledInput';
import StyledFileInput from '../components/StyledFileInput';

export default function AddNewProduct() {
	const [product, setProduct] = useState({ name: '', description: '', price: '', categoryId: null, featured: false });
	const { name, description, price, categoryId, featured } = product;
	const [image, setImage] = useState(null);
	const [productCategories, setProductCategories] = useState([]);
	const [newCategory, setNewCategory] = useState('');

	const { accessToken } = useAuth();

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
		if (name == '' || price == '' || image === null) {
			//ovo sredi
			console.log('propala validacija');
			return;
		}
		// da li je unesena nova kategorija
		var newCategoryId = null;
		if (newCategory !== '') {
			try {
				let result = await axios.post(
					'https://localhost:7196/api/ProductCategories',
					{ name: newCategory },
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
				newCategoryId = result.data.id;
			} catch (error) {
				console.log(error.message);
				return;
			}
		}
		const data = new FormData();
		data.append('Name', name);
		data.append('Price', Number(price));
		data.append('Description', description);
		data.append('Image', image);
		data.append('Featured', featured);
		if (newCategoryId !== null) {
			data.append('ProductCategoryId', newCategoryId);
		} else if (categoryId !== null && categoryId !== 'null') {
			data.append('ProductCategoryId', categoryId);
		}

		try {
			await axios.post(`https://localhost:7196/api/Products/`, data, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			navigate('/manage-products');
		} catch (error) {
			console.log(error.message); // prikazi neku gresku
		}
	}

	return (
		<div className='mx-8 mt-8 min-h-fit rounded-xl bg-white'>
			<img
				src={image ? URL.createObjectURL(image) : 'https://fakeimg.pl/800x450?text=Image+preview&font=noto'}
				alt={name + ' image'}
				className='m-5 float-left w-96'
			/>
			<StyledInput
				type='text'
				value={name}
				onChange={e => {
					setProduct({ ...product, name: e.target.value });
				}}
			>
				Naziv proizvoda:
			</StyledInput>
			<br />
			<StyledInput
				type='text'
				value={description}
				onChange={e => {
					setProduct({ ...product, description: e.target.value });
				}}
			>
				Opis proizvoda:
			</StyledInput>
			<br />
			<StyledInput
				type='number'
				value={price}
				onChange={e => {
					setProduct({ ...product, price: Number(e.target.value) });
				}}
				step={0.01}
			>
				Cijena:
			</StyledInput>
			<br />
			<StyledInput
				type='checkbox'
				checked={featured}
				onChange={e => {
					setProduct({ ...product, featured: e.target.checked });
				}}
			>
				Izdvoji proizvod:
			</StyledInput>
			<br />
			<label>
				Odaberi postojeću kategoriju:{' '}
				<select
					onChange={e => {
						setProduct({ ...product, categoryId: e.target.value });
					}}
					value={categoryId ?? 'null'}
					disabled={newCategory !== ''}
					className='transition-all duration-300 m-2 p-1 shadow-md focus:outline-none focus:ring focus:ring-blue-600'
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
			<StyledInput
				type='text'
				onChange={e => {
					setNewCategory(e.target.value);
				}}
				value={newCategory}
			>
				Unesi novu kategoriju:
			</StyledInput>
			<br />
			<StyledFileInput onChange={e => setImage(e.target.files[0] ?? null)} accept='image/png, image/jpeg'>
				Nova slika:
			</StyledFileInput>
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
