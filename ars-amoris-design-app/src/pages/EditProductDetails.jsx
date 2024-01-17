import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import StyledInput from '../components/StyledInput';
import StyledFileInput from '../components/StyledFileInput';

export default function EditProductDetails() {
	const [product, setProduct] = useState(null);
	const [newImage, setNewImage] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [productCategories, setProductCategories] = useState([]);
	const [newCategory, setNewCategory] = useState('');
	const { productId } = useParams();
	const navigate = useNavigate();
	const { accessToken } = useAuth();

	// da li fetch kroz api ili primiti objekat kroz properties
	useEffect(() => {
		const fetchProduct = async () => {
			setIsLoading(true);
			let result = await axios.get(`https://localhost:7196/api/Products/${productId}`);
			setProduct(result.data);
			setIsLoading(false);
		};
		const fetchProductCategories = async () => {
			let result = await axios.get(`https://localhost:7196/api/ProductCategories`);
			setProductCategories(result.data);
		};
		fetchProduct();
		fetchProductCategories();
	}, [productId]); // treba li ovdje neki cleanup

	// effect da revoke object url
	async function handleProductUpdate() {
		if (product.name == '' || product.price == '') {
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
		data.append('Name', product.name);
		data.append('Price', Number(product.price));
		data.append('Description', product.description);
		data.append('Image', newImage);
		data.append('Featured', product.featured);
		if (newCategoryId !== null) {
			data.append('ProductCategoryId', newCategoryId);
		} else if (product.categoryId !== null && product.categoryId !== 'null') {
			data.append('ProductCategoryId', product.categoryId);
		}

		try {
			await axios.put(`https://localhost:7196/api/Products/${productId}`, data, {
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
		<>
			{isLoading ? (
				<LoadingIndicator />
			) : (
				<div className='mx-8 mt-8 min-h-fit rounded-xl bg-white'>
					<img
						src={newImage ? URL.createObjectURL(newImage) : product.imageUrl}
						alt={product.name + ' image'}
						className='m-5 float-left w-96'
					/>
					<StyledInput
						type='text'
						value={product.name}
						onChange={e => {
							setProduct({ ...product, name: e.target.value });
						}}
					>
						Naziv proizvoda:
					</StyledInput>
					<br />
					<StyledInput
						type='text'
						value={product.description}
						onChange={e => {
							setProduct({ ...product, description: e.target.value });
						}}
					>
						Opis proizvoda:
					</StyledInput>
					<br />
					<StyledInput
						type='number'
						value={product.price}
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
						checked={product.featured}
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
							value={product.categoryId ?? 'null'}
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
					</label>
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
					<StyledFileInput onChange={e => setNewImage(e.target.files[0])} accept='image/png, image/jpeg'>
						Nova slika:
					</StyledFileInput>
					<br />
					<div className='p-3'>
						<Button onClick={handleProductUpdate}>Potvrdi izmjene</Button>
					</div>
					<div className='p-3'>
						<Button onClick={() => navigate('/manage-products')}>Odustani</Button>
					</div>
					<div className='clear-both'></div>
				</div>
			)}
		</>
	);
}
