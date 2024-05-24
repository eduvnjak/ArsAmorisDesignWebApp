import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';
import ProductForm from '../components/ProductForm';
import useAxios from '../api/useAxios';

export default function EditProductDetails() {
	const [product, setProduct] = useState({});
	const {
		name,
		description,
		price,
		categoryId,
		featured,
		newCategory,
		images,
	} = product;

	const [isLoading, setIsLoading] = useState(true);
	const { productId } = useParams();
	const navigate = useNavigate();
	const axiosInstance = useAxios();

	// da li fetch kroz api ili primiti objekat kroz properties
	useEffect(() => {
		const fetchProduct = async () => {
			setIsLoading(true);
			let result = await axiosInstance.get(`Products/${productId}`);
			setProduct({ newCategory: '', ...result.data });
			setIsLoading(false);
		};
		fetchProduct();
	}, [productId, axiosInstance]); // treba li ovdje neki cleanup

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
		let newCount = 0;
		let existingCount = 0;
		images.forEach((image, index) => {
			if (image instanceof File) {
				// console.log('File ' + index);
				data.append(`NewImages[${newCount}].Index`, index);
				data.append(`NewImages[${newCount}].File`, image);
				newCount++;
			} else if (typeof image == 'string') {
				// console.log('String ' + index);
				data.append(`ExistingImages[${existingCount}].Index`, index);
				data.append(
					`ExistingImages[${existingCount}].ImageName`,
					image.match(/([^/]+)\/?$/)[0],
				);
				existingCount++;
			}
		});
		data.append('Featured', featured);
		if (newCategoryId !== null) {
			data.append('ProductCategoryId', newCategoryId);
		} else if (categoryId !== null && categoryId !== 'null') {
			data.append('ProductCategoryId', categoryId);
		}

		try {
			// console.log('PUT');
			await axiosInstance.put(`Products/${productId}`, data);
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
					onSave={handleUpdateProduct}
				/>
			)}
		</>
	);
}
