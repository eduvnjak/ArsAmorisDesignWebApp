import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import useAxios from '../api/useAxios';

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
	const { name, description, price, categoryId, featured, newCategory, image } =
		product;

	const navigate = useNavigate();
	const axiosInstance = useAxios();

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
				let result = await axiosInstance.post(`ProductCategories`, {
					name: newCategory,
				});
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
			await axiosInstance.post(`Products/`, data);
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
