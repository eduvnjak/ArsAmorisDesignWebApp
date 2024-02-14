/* eslint-disable react/prop-types */

export default function ProductCard({
	children,
	name,
	price,
	imageUrl,
	categoryName,
}) {
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
			<div className='flex grow flex-col justify-end gap-4 p-6'>
				<h2 className='truncate text-2xl font-bold text-slate-800 sm:w-[296px]'>
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
