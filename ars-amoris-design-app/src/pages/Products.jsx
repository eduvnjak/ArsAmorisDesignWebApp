import { useState, useEffect, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import { matchSorter } from 'match-sorter';
import LoadingIndicator from '../components/LoadingIndicator';
import { useNavigate } from 'react-router-dom';
import MultipleSelect from '../components/MultpleSelect';
import Button from '../components/Button';
import StyledInput from '../components/StyledInput';
import ProductContainer from '../components/ProductContainer';
import useAxios from '../api/useAxios';

export default function Products() {
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [searchQuery, setSearchQuery] = useState('');
	const [sortValue, setSortValue] = useState('default');
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [categories, setCategories] = useState([]);
	const navigate = useNavigate();
	const axiosInstance = useAxios();

	const searchBarRef = useRef(null);

	useEffect(() => {
		async function fetchProducts() {
			setIsLoading(true);
			let result = await axiosInstance.get(`Products`);
			setProducts(result.data);
			setIsLoading(false);
		}
		async function fetchProductCategories() {
			let result = await axiosInstance.get(`ProductCategories`);
			setCategories(result.data);
		}
		fetchProducts();
		fetchProductCategories();
	}, [axiosInstance]);

	useEffect(() => {
		function searchBarFocus(e) {
			if (e.ctrlKey && e.code === 'KeyK') {
				e.preventDefault();
				if (searchBarRef.current !== null) {
					searchBarRef.current.focus();
				}
			}
		}
		window.addEventListener('keydown', searchBarFocus);
		return () => window.removeEventListener('keydown', searchBarFocus);
	}, []);

	function handleSearch(newSearchQuery) {
		setSearchQuery(newSearchQuery);
		if (newSearchQuery.trim().length === 0) return;
		setFilteredProducts(
			matchSorter(products, newSearchQuery.trim(), {
				keys: ['name'],
				sorter: rankedItems => rankedItems,
			}),
		);
	}

	async function handleSort(newSortValue) {
		setSortValue(newSortValue);
		setIsLoading(true);
		let result = await axiosInstance.get(
			`Products?categories=${selectedCategories.join(',')}${
				newSortValue !== 'default' ? `&sortBy=${newSortValue}` : ''
			}`,
		);
		setProducts(result.data);
		setIsLoading(false);
		if (searchQuery.trim().length === 0) return;
		setFilteredProducts(
			matchSorter(result.data, searchQuery.trim(), {
				keys: ['name'],
				sorter: rankedItems => rankedItems,
			}),
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
		let result = await axiosInstance.get(
			`Products?categories=${newCategories.join(',')}${
				sortValue !== 'default' ? `&sortBy=${sortValue}` : ''
			}`,
		);
		setProducts(result.data);
		setIsLoading(false);
		if (searchQuery.trim().length === 0) return;
		setFilteredProducts(
			matchSorter(result.data, searchQuery.trim(), {
				keys: ['name'],
				sorter: rankedItems => rankedItems,
			}),
		);
	}
	return (
		<>
			<h1 className='py-3 text-center text-4xl font-medium text-white'>
				Proizvodi
			</h1>
			<div className='mx-auto w-fit rounded-xl bg-slate-50 p-3 text-center font-medium shadow-2xl'>
				<StyledInput
					type='text'
					value={searchQuery}
					onChange={e => handleSearch(e.target.value)}
					placeholder={'Ctrl + K '}
					style={{ paddingLeft: '30px' }}
					ref={searchBarRef}
				>
					Pretraži proizvode:{' '}
					<span className='absolute inset-y-0 left-[150px] flex items-center pl-1'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='currentColor'
							className='h-5 w-5'
						>
							<path
								fillRule='evenodd'
								d='M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z'
								clipRule='evenodd'
							/>
						</svg>
					</span>
				</StyledInput>
				<label>
					Sortiraj proizvode:
					<select
						value={sortValue}
						onChange={e => handleSort(e.target.value)}
						className='m-2 p-1 shadow-md transition-all duration-300 focus:outline-none focus:ring focus:ring-blue-600'
					>
						<option value='default'>Zadano</option>
						<option value='nameAsc'>Po nazivu abecedno</option>
						<option value='nameDesc'>Po nazivu obrnuto abecedno</option>
						<option value='priceAsc'>Po cijeni od najmanje</option>
						<option value='priceDesc'>Po cijeni od najveće</option>
					</select>
				</label>
				<MultipleSelect
					options={categories}
					selectedOptions={selectedCategories}
					onChange={handleCategoryFilter}
				/>
			</div>
			{isLoading ? (
				<LoadingIndicator />
			) : (
				<ProductContainer>
					{searchQuery.trim().length === 0
						? products.map(product => (
								<ProductCard
									key={product.id}
									product={product}
								>
									<Button
										onClick={() => {
											navigate(`${product.id}`);
										}}
									>
										Pogledaj detalje
									</Button>
								</ProductCard>
							))
						: filteredProducts.map(product => (
								<ProductCard
									key={product.id}
									product={product}
								>
									<Button
										onClick={() => {
											navigate(`${product.id}`);
										}}
									>
										Pogledaj detalje
									</Button>
								</ProductCard>
							))}
				</ProductContainer>
			)}
		</>
	);
}
