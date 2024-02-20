/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';

export default function ProductCard({
	children,
	name,
	price,
	imageUrl,
	categoryName,
}) {
	const nameRef = useRef(null);
	useEffect(() => {
		if (nameRef.current !== null && nameRef.current.scrollWidth > 296) {
			nameRef.current.classList.add('name-tooltip');
		}
	}, []);

	const duration = Math.random() * 500 + 300;
	return (
		<div
			className='m-2 flex animate-pop-in flex-col rounded bg-slate-50 p-0.5 shadow-2xl sm:flex-row'
			style={{
				animationDuration: `${duration}ms`,
				animationFillMode: 'backwards',
			}}
		>
			<div className='h-64 shrink-0 sm:w-64'>
				<img
					src={imageUrl}
					alt={name + ' image'}
					className='h-full w-full rounded object-cover'
				/>
			</div>
			<div className='relative flex grow flex-col justify-end gap-4 p-6'>
				<h2
					ref={nameRef}
					data-tooltip={name}
					className='text-2xl font-bold text-slate-800 sm:w-[296px] 
					sm:truncate sm:after:absolute sm:after:right-[50%] sm:after:-translate-y-[100%] sm:after:translate-x-[50%] sm:after:rounded-sm
					sm:after:bg-slate-500 sm:after:px-4 sm:after:py-2 sm:after:text-sm sm:after:font-normal sm:after:text-slate-50 
					sm:after:opacity-0 sm:after:transition sm:after:duration-200 sm:after:content-[attr(data-tooltip)] [&.name-tooltip]:sm:hover:after:opacity-100'
				>
					{name}
				</h2>
				<div className='flex items-baseline justify-between px-2 sm:flex-col'>
					<span>{categoryName ?? 'Nekategorisan'}</span>
					<span className='text-lg font-bold'>{price} BAM</span>
				</div>
				<div className='mt-6 flex flex-col gap-4 sm:flex-row'>{children}</div>
			</div>
		</div>
	);
}
