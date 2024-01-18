import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProductForm from '../components/ProductForm';

export default function AddNewProduct() {
	const [product, setProduct] = useState({
		name: '',
		description: '',
		price: '',
		categoryId: null,
		featured: false,
		newCategory: '',
		image: null,
	});
	const { name, description, price, categoryId, featured, newCategory, image } = product;

	const { accessToken } = useAuth();
	const navigate = useNavigate();

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
		<ProductForm
			product={product}
			setProduct={setProduct}
			onAccept={handleAddProduct}
			acceptLabel='Dodaj novi proizvod'
		/>
	);
}
