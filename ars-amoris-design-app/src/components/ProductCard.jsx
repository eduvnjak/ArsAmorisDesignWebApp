export default function ProductCard({ name, price, imageUrl, showDetails }) {
	return (
		<div className='m-2 bg-slate-50 rounded-xl p-3 shadow-2xl text-center'>
			<div className='w-52 h-52 flex mx-auto items-center justify-center'>
				<img src={imageUrl} alt={name + ' image'} className='mx-auto max-h-full max-w-full' />
			</div>
			<h3>{name}</h3>
			<div className='font-medium font'>Cijena: {price}</div>
			<button
				className='transition-colors duration-300 hover:border-blue-500 hover:border-4 hover:p-3 mx-auto p-4 font-medium hover:from-white hover:to-white hover:text-blue-500 text-white bg-gradient-to-l from-blue-400 to-blue-500 shadow-md rounded-full border-0'
				onClick={showDetails}
			>
				Pogledaj detalje
			</button>
		</div>
	);
}
