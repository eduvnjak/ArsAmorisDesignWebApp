/* eslint-disable react/prop-types */

export default function ProductCard({ children, name, price, imageUrl, categoryName }) {
	return (
		<div className='m-2 bg-slate-50 rounded-xl p-3 shadow-2xl text-center'>
			<div className='w-52 h-52 flex mx-auto items-center justify-center'>
				<img src={imageUrl} alt={name + ' image'} className='mx-auto max-h-full max-w-full' />
			</div>
			<h3>{name}</h3>
			<div className='font-medium font'>Cijena: {price}</div>
			<div className='font-medium font'>{categoryName ?? 'Nekategorisan'}</div>
			<div className='flex gap-3 justify-center'>{children}</div>
		</div>
	);
}
