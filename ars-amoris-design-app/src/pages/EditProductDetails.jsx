import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';
import { useAuth } from '../contexts/AuthContext';
import ProductForm from '../components/ProductForm';

export default function EditProductDetails() {
	const [product, setProduct] = useState({});
	const { name, description, price, categoryId, featured, newCategory, image } = product;

	const [isLoading, setIsLoading] = useState(true);
	const { productId } = useParams();
	const navigate = useNavigate();
	const { accessToken } = useAuth();

	// da li fetch kroz api ili primiti objekat kroz properties
	useEffect(() => {
		const fetchProduct = async () => {
			setIsLoading(true);
			let result = await axios.get(`https://localhost:7196/api/Products/${productId}`);
			setProduct({ newCategory: '', image: null, ...result.data });
			setIsLoading(false);
		};
		fetchProduct();
	}, [productId]); // treba li ovdje neki cleanup

	async function handleUpdateProduct() {
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
				<ProductForm
					product={product}
					setProduct={setProduct}
					onAccept={handleUpdateProduct}
					acceptLabel={'Potvrdi izmjene'}
				/>
			)}
		</>
	);
}
