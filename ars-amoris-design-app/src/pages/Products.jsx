import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { matchSorter } from 'match-sorter';
import LoadingIndicator from '../components/LoadingIndicator';
import { useNavigate } from 'react-router-dom';
import MultipleSelect from '../components/MultpleSelect';

export default function Products() {
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [searchQuery, setSearchQuery] = useState('');
	const [sortValue, setSortValue] = useState('default');
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [categories, setCategories] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchProducts() {
			setIsLoading(true);
			let result = await axios.get(`https://localhost:7196/api/Products`);
			setProducts(result.data);
			setIsLoading(false);
		}
		async function fetchProductCategories() {
			let result = await axios.get('https://localhost:7196/api/ProductCategories');
			setCategories(result.data);
		}
		fetchProducts();
		fetchProductCategories();
	}, []);

	function handleSearch(newSearchQuery) {
		setSearchQuery(newSearchQuery);
		if (newSearchQuery.trim().length === 0) return;
		setFilteredProducts(
			matchSorter(products, newSearchQuery.trim(), {
				keys: ['name'],
				sorter: rankedItems => rankedItems,
			})
		);
	}

	async function handleSort(newSortValue) {
		setSortValue(newSortValue);
		setIsLoading(true);
		let result = await axios.get(
			`https://localhost:7196/api/Products?categories=${selectedCategories.join(',')}${
				newSortValue !== 'default' ? `&sortBy=${newSortValue}` : ''
			}`
		);
		setProducts(result.data);
		setIsLoading(false);
		if (searchQuery.trim().length === 0) return;
		setFilteredProducts(
			matchSorter(result.data, searchQuery.trim(), {
				keys: ['name'],
				sorter: rankedItems => rankedItems,
			})
		);
	}

	async function handleCategoryFilter(id) {
		let newCategories;
		if (selectedCategories.includes(id)) {
			newCategories = selectedCategories.filter(sid => sid !== id);
		} else {
			newCategories = [...selectedCategories, id];
		}
		setSelectedCategories(newCategories);
		setIsLoading(true);
		let result = await axios.get(
			`https://localhost:7196/api/Products?categories=${newCategories.join(',')}${
				sortValue !== 'default' ? `&sortBy=${sortValue}` : ''
			}`
		);
		setProducts(result.data);
		setIsLoading(false);
		if (searchQuery.trim().length === 0) return;
		setFilteredProducts(
			matchSorter(result.data, searchQuery.trim(), {
				keys: ['name'],
				sorter: rankedItems => rankedItems,
			})
		);
	}
	return (
		<>
			<h1 className='text-center text-white py-3 font-medium text-4xl'>Proizvodi</h1>
			<div className='bg-slate-50 mx-auto w-fit rounded-xl shadow-2xl text-center p-3 font-medium'>
				<label>
					Pretraži proizvode:{' '}
					<input
						className='transition-all duration-300 p-1 shadow-md focus:outline-none focus:ring focus:ring-blue-600'
						type='text'
						value={searchQuery}
						onChange={e => handleSearch(e.target.value)}
					></input>
				</label>
				<label>
					{' '}
					Sortiraj proizvode:{' '}
					<select
						value={sortValue}
						onChange={e => handleSort(e.target.value)}
						className='transition-all duration-300 p-1 shadow-md focus:outline-none focus:ring focus:ring-blue-600'
					>
						<option value='default'>Zadano</option>
						<option value='nameAsc'>Po nazivu abecedno</option>
						<option value='nameDesc'>Po nazivu obrnuto abecedno</option>
						<option value='priceAsc'>Po cijeni od najmanje</option>
						<option value='priceDesc'>Po cijeni od najveće</option>
					</select>
				</label>{' '}
				<MultipleSelect options={categories} selectedOptions={selectedCategories} onChange={handleCategoryFilter} />
			</div>
			{isLoading ? (
				<LoadingIndicator />
			) : (
				<div className='flex flex-row flex-wrap px-2'>
					{searchQuery.trim().length === 0
						? products.map(product => (
								<ProductCard
									key={product.id}
									name={product.name}
									price={product.price}
									imageUrl={product.imageUrl}
									categoryName={product.categoryName}
									showDetails={() => {
										navigate(`${product.id}`);
									}}
								/>
						  ))
						: filteredProducts.map(product => (
								<ProductCard
									key={product.id}
									name={product.name}
									price={product.price}
									imageUrl={product.imageUrl}
									categoryName={product.categoryName}
									showDetails={() => {
										navigate(`${product.id}`);
									}}
								/>
						  ))}
				</div>
			)}
		</>
	);
}
