import StyledInput from './StyledInput';
import StyledFileInput from './StyledFileInput';
import { useState, useEffect } from 'react';
import Button from './Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProductForm({ product, setProduct, onAccept, acceptLabel }) {
	const [productCategories, setProductCategories] = useState([]);
	const { name, description, price, categoryId, imageUrl, featured, newCategory, image } = product;
	const navigate = useNavigate();
	const [newImageUrl, setNewImageUrl] = useState(null);

	useEffect(() => {
		const fetchProductCategories = async () => {
			let result = await axios.get(`https://localhost:7196/api/ProductCategories`);
			setProductCategories(result.data);
		};
		fetchProductCategories();
	}, []);

	useEffect(() => {
		return () => {
			if (newImageUrl !== null) {
				URL.revokeObjectURL(newImageUrl);
			}
		};
	}, [newImageUrl]);

	function handleChange(e) {
		let value;
		switch (e.target.name) {
			case 'featured':
				value = e.target.checked;
				break;
			case 'image':
				if (newImageUrl !== null) {
					URL.revokeObjectURL(newImageUrl);
				}
				value = e.target.files[0] ?? null;
				value !== null ? setNewImageUrl(URL.createObjectURL(value)) : setNewImageUrl(null);
				break;
			default:
				value = e.target.value;
				break;
		}
		setProduct({ ...product, [e.target.name]: value });
	}
	function handleCancel() {
		URL.revokeObjectURL(newImageUrl);
		setProduct({ ...product, image: null });
	}

	const imageSource =
		image !== null
			? newImageUrl
			: imageUrl !== undefined
			? imageUrl
			: 'https://fakeimg.pl/450x250?text=Image+preview&font=noto';

	return (
		<div className='mx-8 mt-8 min-h-fit rounded-xl bg-white'>
			<div className='float-left w-[500px] h-[500px] flex items-center justify-center'>
				<img src={imageSource} alt={name + ' image'} className='p-3 mx-auto max-h-full max-w-full' />
			</div>
			<StyledInput type='text' value={name} name='name' onChange={handleChange}>
				Naziv proizvoda:
			</StyledInput>
			<br />
			<StyledInput type='text' value={description} name='description' onChange={handleChange}>
				Opis proizvoda:
			</StyledInput>
			<br />
			<StyledInput
				type='number'
				value={price} //pazi ovdje
				name='price'
				onChange={handleChange}
				step={0.01}
			>
				Cijena:
			</StyledInput>
			<br />
			<StyledInput type='checkbox' checked={featured} name='featured' onChange={handleChange}>
				Izdvoji proizvod:
			</StyledInput>
			<br />
			<label>
				Odaberi postojeću kategoriju:{' '}
				<select
					onChange={handleChange}
					value={categoryId ?? 'null'}
					name='categoryId'
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
			<StyledInput type='text' onChange={handleChange} value={newCategory} name='newCategory'>
				Unesi novu kategoriju:
			</StyledInput>
			<br />
			<StyledFileInput name='image' onChange={handleChange} onCancel={handleCancel} accept='image/png, image/jpeg'>
				Odaberi novu sliku
			</StyledFileInput>
			<br />
			<div className='p-3'>
				<Button onClick={onAccept}>{acceptLabel}</Button>
			</div>
			<div className='p-3'>
				<Button onClick={() => navigate('/manage-products')}>Odustani</Button>
			</div>
			<div className='clear-both'></div>
		</div>
	);
}
