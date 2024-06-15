/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../api/useAxios';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {
	DndContext,
	closestCenter,
	useSensors,
	useSensor,
	PointerSensor,
	KeyboardSensor,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
	sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import uuid from '../utils/uuid';

export default function ProductForm({ product, setProduct, onSave }) {
	const [productCategories, setProductCategories] = useState([]);
	// const [parent, enableAnimations] = useAutoAnimate({ duration: 400 });
	const {
		name,
		description,
		price,
		categoryId,
		featured,
		newCategory,
		images,
	} = product;
	const navigate = useNavigate();
	const axiosInstance = useAxios();

	useEffect(() => {
		const fetchProductCategories = async () => {
			let result = await axiosInstance.get(`ProductCategories`);
			setProductCategories(result.data);
		};
		fetchProductCategories();
	}, [axiosInstance]);

	function handleChange(e) {
		let value;
		switch (e.target.name) {
			case 'featured':
				value = e.target.checked;
				break;
			default:
				value = e.target.value;
				break;
		}
		setProduct({ ...product, [e.target.name]: value });
	}

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
		const fileList = [...event.target.files];
		// fileList.forEach(file => (file.key = crypto.randomUUID()));
		// ovo ispod za mob
		fileList.forEach(file => (file.key = uuid()));
		setProduct({ ...product, images: [...images, ...fileList] });
	}
	function handleDelete(key) {
		setProduct({
			...product,
			images: images.filter(img => img.key !== key),
		});
	}
	function moveDown(index) {
		if (index === images.length - 1) return;
		const newArray = [...images];
		const temp = newArray[index];
		newArray[index] = newArray[index + 1];
		newArray[index + 1] = temp;
		setProduct({ ...product, images: newArray });
	}
	function moveUp(index) {
		if (index === 0) return;
		const newArray = [...images];
		const temp = newArray[index];
		newArray[index] = newArray[index - 1];
		newArray[index - 1] = temp;
		setProduct({ ...product, images: newArray });
	}

	function handleDragEnd(event) {
		//setIsDragging(false);
		const { active, over } = event;
		const getImageIndex = key => images.findIndex(image => image.key === key);

		if (active.id !== over.id) {
			setProduct(product => {
				const oldIndex = getImageIndex(active.id);
				const newIndex = getImageIndex(over.id);

				const newImages = arrayMove(images, oldIndex, newIndex);
				return { ...product, images: newImages };
			});
		}
		//enableAnimations(true);
	}
	function handleDragStart() {
		//enableAnimations(false);
	}
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

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
						<div className='peer'>
							<StyledInput
								value={name}
								onChange={handleChange}
								id='name'
								name='name'
								type='text'
								pattern='\s*\S.{3,}\S\s*'
							></StyledInput>
						</div>
						<ValidationMessage>
							Naziv mora imati bar 5 karaktera
						</ValidationMessage>
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
					<div>
						<label
							htmlFor='price'
							className='block text-sm font-medium text-slate-900'
						>
							Cijena
						</label>
						<div className='peer relative mt-2 sm:max-w-40'>
							<input
								placeholder='0.0'
								value={price}
								onChange={handleChange}
								id='price'
								name='price'
								step={0.1}
								min={0}
								type='number'
								className='w-full rounded-sm border-0 px-2 py-1 shadow-sm outline outline-1 outline-slate-300 invalid:outline-red-500 focus:outline-2 focus:outline-blue-500 focus:invalid:outline-red-500 focus:invalid:ring-red-500 '
							></input>
							<div className='absolute bottom-0 right-8 top-0 flex items-center'>
								<span className='text-sm text-slate-600'>BAM</span>
							</div>
						</div>
						<ValidationMessage>Cijena mora biti nenegativna.</ValidationMessage>
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
					<div className='space-y-2 sm:flex sm:items-start sm:justify-center sm:space-y-0'>
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
									className='mt-2 w-full rounded-sm border-0 bg-white px-2 py-1 shadow-sm outline outline-1 outline-slate-300 ring-inset focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500'
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
						<div className='relative flex justify-center sm:top-8'>
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
							<div className='peer'>
								<StyledInput
									value={newCategory}
									onChange={handleChange}
									id='newCategory'
									name='newCategory'
									type='text'
									pattern='\s*\S.{3,}\S\s*'
								></StyledInput>
							</div>
							<ValidationMessage>
								Naziv mora imati bar 5 karaktera
							</ValidationMessage>
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
						<DndContext
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
							onDragStart={handleDragStart}
							sensors={sensors}
						>
							<div
								//ref={parent}
								className='flex min-h-20 flex-col gap-2 rounded-sm px-2 py-1 outline-dashed outline-1 outline-slate-300'
							>
								{images.length === 0 ? (
									<div className='grid h-20 w-full place-content-center text-center text-sm text-slate-600'>
										Dodane slike će biti prikazane ovdje
									</div>
								) : (
									<SortableContext
										items={images.map(image => image.key)}
										strategy={verticalListSortingStrategy}
									>
										{images.map((image, index) => (
											<ImageListElement
												id={image.key}
												key={image.key}
												image={image}
												onDelete={handleDelete}
												moveUp={() => moveUp(index)}
												moveDown={() => moveDown(index)}
												first={index === 0}
												last={index === images.length - 1}
											></ImageListElement>
										))}
									</SortableContext>
								)}
							</div>
						</DndContext>
						<p className='text-sm text-slate-600'>
							Dodaj jednu do pet slika proizvoda.
						</p>
					</div>
					<div className='flex justify-end gap-2 border-t py-4'>
						<button
							onClick={() => navigate('/manage-products')}
							className='rounded px-4 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
						>
							Odustani
						</button>
						<button
							type='button'
							onClick={onSave}
							className='rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
						>
							Sačuvaj
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

function StyledInput({ ...rest }) {
	return (
		<input
			{...rest}
			className='mt-2 w-full rounded-sm border-0 px-2 py-1 shadow-sm outline outline-1 outline-slate-300 invalid:outline-red-500 focus:outline-2 focus:outline-blue-500 focus:invalid:outline-red-500 focus:invalid:ring-red-500'
		></input>
	);
}

function ImageListElement({
	id,
	image,
	onDelete,
	moveUp,
	moveDown,
	first,
	last,
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const [imageUrl, setImageUrl] = useState(image.url);
	const { name } = image;
	// URL.createObjectURL(file);
	useEffect(() => {
		if (!(image instanceof File)) return;
		const url = URL.createObjectURL(image);
		setImageUrl(url);
		return () => {
			URL.revokeObjectURL(url);
		};
	}, [image]);

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			style={style}
			ref={setNodeRef}
			{...attributes}
			className={`group flex flex-row items-center justify-between gap-2 ${isDragging && 'z-50 bg-slate-100 '}`}
		>
			<div className='flex h-32 flex-col justify-between px-1 py-2'>
				<button type='button' onClick={moveUp} disabled={first === true}>
					<ChevronUp></ChevronUp>
				</button>
				<button className='touch-none' type='button' {...listeners}>
					<GripDotsIcon />
				</button>
				<button type='button' onClick={moveDown} disabled={last === true}>
					<ChevronDown></ChevronDown>
				</button>
			</div>
			<img src={imageUrl} className='size-28 object-contain sm:size-64'></img>
			<span className='w-12 break-words text-xs text-slate-600 sm:w-36 sm:text-sm'>
				{name}
			</span>
			<div onClick={() => onDelete(image.key)}>
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
			className='h-6 w-6 cursor-pointer stroke-slate-500 hover:stroke-slate-900'
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
			className='h-6 w-6 stroke-slate-500 hover:stroke-slate-900 group-first:hover:stroke-slate-500'
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
			className='h-6 w-6 stroke-slate-500 hover:stroke-slate-900 group-last:hover:stroke-slate-500'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='m19.5 8.25-7.5 7.5-7.5-7.5'
			/>
		</svg>
	);
}

function GripDotsIcon() {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className='h-6 w-6 stroke-slate-500 hover:cursor-grab'
		>
			<path
				d='M9 6H9.01M15 6H15.01M15 12H15.01M9 12H9.01M9 18H9.01M15 18H15.01M10 6C10 6.55228 9.55228 7 9 7C8.44772 7 8 6.55228 8 6C8 5.44772 8.44772 5 9 5C9.55228 5 10 5.44772 10 6ZM16 6C16 6.55228 15.5523 7 15 7C14.4477 7 14 6.55228 14 6C14 5.44772 14.4477 5 15 5C15.5523 5 16 5.44772 16 6ZM10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12ZM16 12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12C14 11.4477 14.4477 11 15 11C15.5523 11 16 11.4477 16 12ZM10 18C10 18.5523 9.55228 19 9 19C8.44772 19 8 18.5523 8 18C8 17.4477 8.44772 17 9 17C9.55228 17 10 17.4477 10 18ZM16 18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18C14 17.4477 14.4477 17 15 17C15.5523 17 16 17.4477 16 18Z'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	);
}

function ValidationMessage({ children }) {
	return (
		<div className='mt-2 hidden text-sm font-semibold text-red-500 peer-has-[:invalid]:block'>
			{children}
		</div>
	);
}
