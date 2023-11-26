import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { matchSorter } from 'match-sorter';
import LoadingIndicator from './LoadingIndicator';

export default function Products() {
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [sortValue, setSortValue] = useState('default');

	useEffect(() => {
		async function fetchProducts() {
			setIsLoading(true);
			let result = await axios.get(
				`https://localhost:7196/api/Products${sortValue !== 'default' ? `?sortBy=${sortValue}` : ''}`
			);
			setProducts(result.data);
			setIsLoading(false);
		}
		fetchProducts();
	}, [sortValue]);

	// function handleSearch(e) {
	// 	setSearchQuery(e.target.value);
	// 	setFilteredProducts(matchSorter(products, e.target.value, { keys: ['name'], sorter: rankedItems => rankedItems.sort(getCompareFun(sortValue)) }));
	// }

	function handleSort(e) {
		setSortValue(e.target.value);
		// let compareFun = getCompareFun(e.target.value);
		// const newProducts = products.sort(compareFun);
		// setProducts(newProducts);
		// setFilteredProducts(
		// 	matchSorter(products, searchQuery, { keys: ['name'], sorter: rankedItems => rankedItems.sort(compareFun) })
		// );
		// console.log(
		// 	matchSorter(products, searchQuery, { keys: ['name'], sorter: rankedItems => rankedItems.sort(compareFun) })
		// );
	}
	return (
		<>
			<h1 className='text-center text-white py-3 font-medium text-4xl'>Proizvodi</h1>
			<div className='bg-slate-50 mx-auto w-fit rounded-xl shadow-2xl text-center p-3 font-medium'>
				{/* <label>
					Pretraži proizvode:{' '}
					<input
						className='transition-all duration-300 p-1 shadow-md focus:outline-none focus:ring focus:ring-blue-600'
						type='text'
						value={searchQuery}
						onChange={e => handleSearch(e)}
					></input>
				</label> */}
				<label>
					{' '}
					Sortiraj proizvode:{' '}
					<select
						value={sortValue}
						onChange={e => handleSort(e)}
						className='transition-all duration-300 p-1 shadow-md focus:outline-none focus:ring focus:ring-blue-600'
					>
						<option value='default'>Zadano</option>
						<option value='nameAsc'>Po nazivu abecedno</option>
						<option value='nameDesc'>Po nazivu obrnuto abecedno</option>
						<option value='priceAsc'>Po cijeni od najmanje</option>
						<option value='priceDesc'>Po cijeni od najveće</option>
					</select>
				</label>
			</div>
			{isLoading ? (
				<LoadingIndicator />
			) : (
				<div className='flex flex-row flex-wrap px-2'>
					{searchQuery.length === 0
						? products.map(product => (
								<ProductCard
									key={product.id}
									name={product.name}
									price={product.price}
									imageUrl={product.imageUrl}
									showDetails={() => {
										navigate(`products/${product.id}`);
									}}
								/>
						  ))
						: filteredProducts.map(product => (
								<ProductCard
									key={product.id}
									name={product.name}
									price={product.price}
									imageUrl={product.imageUrl}
									showDetails={() => {
										navigate(`products/${product.id}`);
									}}
								/>
						  ))}
				</div>
			)}
		</>
	);
}
