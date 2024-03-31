import StyledFileInput from './StyledFileInput';
import { useState, useEffect } from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import useAxios from '../api/useAxios';

export default function ProductForm({
	product,
	setProduct,
	onAccept,
	acceptLabel,
}) {
	const [productCategories, setProductCategories] = useState([]);
	const {
		name,
		description,
		price,
		categoryId,
		imageUrl,
		featured,
		newCategory,
		image,
	} = product;
	const navigate = useNavigate();
	const [newImageUrl, setNewImageUrl] = useState(null);
	const axiosInstance = useAxios();

	useEffect(() => {
		const fetchProductCategories = async () => {
			let result = await axiosInstance.get(`ProductCategories`);
			setProductCategories(result.data);
		};
		fetchProductCategories();
	}, [axiosInstance]);

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
				value !== null
					? setNewImageUrl(URL.createObjectURL(value))
					: setNewImageUrl(null);
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

	const [images, setImages] = useState([]);

	function handleImageChange(event) {
		if (images.length === 5) {
			console.log('pun');
			return;
		}
		if (event.target.files.length > 5) {
			console.log('odaberi maksimalno 5 slika');
			return;
		}
		if (event.target.files.length + images.length > 5) {
			console.log(`mozes odabrati jos ${5 - images.length} slika`);
			return;
		}
		console.log(event.target.files);
		const fileList = [...event.target.files];
		fileList.forEach(file => (file.key = crypto.randomUUID()));
		setImages([...images, ...fileList]);
	}
	function handleDelete(key) {
		setImages(images.filter(img => img.key !== key));
	}
	function moveDown(index) {
		if (index === images.length - 1) return;
		const newArray = [...images];
		const temp = newArray[index];
		newArray[index] = newArray[index + 1];
		newArray[index + 1] = temp;
		setImages(newArray);
	}
	function moveUp(index) {
		if (index === 0) return;
		const newArray = [...images];
		const temp = newArray[index];
		newArray[index] = newArray[index - 1];
		newArray[index - 1] = temp;
		setImages(newArray);
	}
	return (
		<div className='h-full w-full bg-white'>
			<div className='mx-auto h-full max-w-2xl px-7 py-8 text-slate-900'>
				<h2 className='font-semibold leading-7'>Proizvod</h2>
				<p className='text-sm text-slate-600'>Unesi detalje proizvoda.</p>
				<form className='mt-10 space-y-6'>
					<div className='sm:max-w-sm'>
						<label
							htmlFor='name'
							className='block text-sm font-medium text-slate-900'
						>
							Naziv
						</label>
						<div>
							<StyledInput
								value={name}
								onChange={handleChange}
								id='name'
								name='name'
								type='text'
							></StyledInput>
						</div>
					</div>
					<div>
						<label
							htmlFor='description'
							className='block text-sm font-medium text-slate-900'
						>
							Opis
						</label>
						<div>
							<textarea
								value={description}
								onChange={handleChange}
								id='description'
								name='description'
								className='mt-2 h-32 w-full rounded-sm border-0 px-2 py-1 shadow-sm outline outline-1 outline-slate-300 focus:outline-2 focus:outline-blue-500'
							></textarea>
						</div>
						<p className='mt-2 text-sm text-slate-600'>
							Opiši proizvod u nekoliko rečenica.
						</p>
					</div>
					<div className='sm:max-w-40'>
						<label
							htmlFor='price'
							className='block text-sm font-medium text-slate-900'
						>
							Cijena
						</label>
						<div className='relative mt-2'>
							<input
								placeholder='0.00'
								value={price}
								onChange={handleChange}
								id='price'
								name='price'
								step={0.01}
								type='number'
								className='w-full rounded-sm border-0 px-2 py-1 shadow-sm outline outline-1 outline-slate-300 focus:outline-2 focus:outline-blue-500'
							></input>
							<div className='absolute bottom-0 right-8 top-0 flex items-center'>
								<span className='text-sm text-slate-600'>BAM</span>
							</div>
						</div>
					</div>
					<div className='flex items-start gap-2'>
						<input
							checked={featured}
							onChange={handleChange}
							id='featured'
							name='featured'
							type='checkbox'
							className='mt-1 h-4 w-4 rounded shadow-sm focus-visible:outline-1 focus-visible:outline-blue-500'
						></input>
						<div>
							<label
								htmlFor='featured'
								className='text-sm font-medium text-slate-900'
							>
								Izdvoji proizvod
							</label>
							<p className='text-sm text-slate-600'>
								Izdvojeni proizvod će biti prikazan na početnoj stranici
							</p>
						</div>
					</div>
					<div className='space-y-2 sm:flex sm:justify-center sm:space-y-0'>
						<div className='flex-1'>
							<label
								htmlFor='categoryId'
								className='block text-sm font-medium text-slate-900'
							>
								Odaberi kategoriju
							</label>
							<div>
								<select
									onChange={handleChange}
									value={categoryId ?? 'null'}
									name='categoryId'
									id='categoryId'
									disabled={newCategory !== ''}
									className='mt-2 w-full rounded-sm border-0 px-2 py-1 shadow-sm outline outline-1 outline-slate-300 ring-inset focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500'
								>
									<option value='null'>Bez kategorije</option>
									{productCategories.map(pc => (
										<option key={pc.id} value={pc.id}>
											{pc.name}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className='relative flex justify-center sm:items-end '>
							<div className='absolute inset-0 flex items-center sm:hidden'>
								<div className='w-full border-t'></div>
							</div>
							<span className='z-10 bg-white px-2 text-sm text-slate-600 sm:mx-2 sm:pb-2'>
								Ili
							</span>
						</div>
						<div className='flex-1'>
							<label
								htmlFor='newCategory'
								className='block text-sm font-medium text-slate-900'
							>
								Unesi novu kategoriju
							</label>
							<div>
								<StyledInput
									value={newCategory}
									onChange={handleChange}
									id='newCategory'
									name='newCategory'
									type='text'
								></StyledInput>
							</div>
						</div>
					</div>
					<div className='space-y-2'>
						<span className='text-sm font-medium text-slate-900'>
							Slike proizvoda
						</span>
						<div>
							<label
								htmlFor='image'
								className='inline-block cursor-pointer rounded px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-100'
							>
								Dodaj slike
							</label>
							<input
								type='file'
								id='image'
								className='hidden'
								multiple
								accept='image/png, image/jpeg'
								onChange={handleImageChange}
							></input>
						</div>
						<div className='flex min-h-20 flex-col gap-2 rounded-sm px-2 py-1 outline-dashed outline-1 outline-slate-300'>
							{images.length === 0 ? (
								<div className='grid h-20 w-full place-content-center text-center text-sm text-slate-600'>
									Dodane slike će biti prikazane ovdje
								</div>
							) : (
								images.map((file, index) => (
									<FileListElement
										key={file.key}
										file={file}
										onDelete={handleDelete}
										moveUp={() => moveUp(index)}
										moveDown={() => moveDown(index)}
									></FileListElement>
								))
							)}
						</div>
						<p className='text-sm text-slate-600'>
							Dodaj jednu do pet slika proizvoda.
						</p>
					</div>
					<div className='flex justify-end gap-2 border-t py-4'>
						<button className='rounded px-4 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'>
							Odustani
						</button>
						<button
							type='submit'
							className='rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
						>
							Sačuvaj
						</button>
					</div>
				</form>
			</div>
		</div>
	);
	// return (
	// 	<div className='mx-8 mt-8 min-h-fit rounded-xl bg-white'>
	// 		<div className='float-left w-[500px] h-[500px] flex items-center justify-center'>
	// 			<img src={imageSource} alt={name + ' image'} className='p-3 mx-auto max-h-full max-w-full' />
	// 		</div>
	// 		<StyledInput type='text' value={name} name='name' onChange={handleChange}>
	// 			Naziv proizvoda:
	// 		</StyledInput>
	// 		<br />
	// 		<StyledInput type='text' value={description} name='description' onChange={handleChange}>
	// 			Opis proizvoda:
	// 		</StyledInput>
	// 		<br />
	// 		<StyledInput
	// 			type='number'
	// 			value={price} //pazi ovdje
	// 			name='price'
	// 			onChange={handleChange}
	// 			step={0.01}
	// 		>
	// 			Cijena:
	// 		</StyledInput>
	// 		<br />
	// 		<StyledInput type='checkbox' checked={featured} name='featured' onChange={handleChange}>
	// 			Izdvoji proizvod:
	// 		</StyledInput>
	// 		<br />
	// 		<label>
	// 			Odaberi postojeću kategoriju:{' '}
	// 			<select
	// 				onChange={handleChange}
	// 				value={categoryId ?? 'null'}
	// 				name='categoryId'
	// 				disabled={newCategory !== ''}
	// 				className='transition-all duration-300 m-2 p-1 shadow-md focus:outline-none focus:ring focus:ring-blue-600'
	// 			>
	// 				<option value='null'>Bez kategorije</option>
	// 				{productCategories.map(pc => (
	// 					<option key={pc.id} value={pc.id}>
	// 						{pc.name}
	// 					</option>
	// 				))}
	// 			</select>
	// 		</label>
	// 		<br />
	// 		<StyledInput type='text' onChange={handleChange} value={newCategory} name='newCategory'>
	// 			Unesi novu kategoriju:
	// 		</StyledInput>
	// 		<br />
	// 		<StyledFileInput name='image' onChange={handleChange} onCancel={handleCancel} accept='image/png, image/jpeg'>
	// 			Odaberi novu sliku
	// 		</StyledFileInput>
	// 		<br />
	// 		<div className='p-3'>
	// 			{/* <Button onClick={onAccept}>{acceptLabel}</Button>  dugme trenutno isključeno */}
	// 			<Button>{acceptLabel}</Button>
	// 		</div>
	// 		<div className='p-3'>
	// 			<Button onClick={() => navigate('/manage-products')}>Odustani</Button>
	// 		</div>
	// 		<div className='clear-both'></div>
	// 	</div>
	// );
}

function StyledInput({ ...rest }) {
	return (
		<input
			{...rest}
			className='mt-2 w-full rounded-sm border-0 px-2 py-1 shadow-sm outline outline-1 outline-slate-300 focus:outline-2 focus:outline-blue-500'
		></input>
	);
}

function FileListElement({ file, onDelete, moveUp, moveDown }) {
	const imageUrl = URL.createObjectURL(file);

	useEffect(() => {
		return () => {
			// URL.revokeObjectURL(imageUrl);
		};
	}, []);

	return (
		<div className='flex flex-row items-center justify-between'>
			<div className='flex flex-col'>
				<div onClick={moveUp}>
					<ChevronUp></ChevronUp>
				</div>
				<div onClick={moveDown}>
					<ChevronDown></ChevronDown>
				</div>
			</div>
			<div className='size-20'>
				<img src={imageUrl}></img>
			</div>
			<div className='text-xs text-slate-600 sm:text-sm'>{file.name}</div>
			<div onClick={() => onDelete(file.key)}>
				<DeleteIcon></DeleteIcon>
			</div>
		</div>
	);
}

function DeleteIcon() {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={1.5}
			stroke='currentColor'
			className='h-6 w-6 stroke-slate-500 hover:cursor-pointer hover:stroke-slate-900'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M6 18 18 6M6 6l12 12'
			/>
		</svg>
	);
}

function ChevronUp() {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={1.5}
			stroke='currentColor'
			className='h-6 w-6'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='m4.5 15.75 7.5-7.5 7.5 7.5'
			/>
		</svg>
	);
}

function ChevronDown() {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={1.5}
			stroke='currentColor'
			className='h-6 w-6'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='m19.5 8.25-7.5 7.5-7.5-7.5'
			/>
		</svg>
	);
}
