export default function ManageProductCard({ name, price, imageUrl, editDetailsHandler, deleteHandler }) {

	return (
		<div className='m-2 bg-slate-50 rounded-xl p-3 shadow-2xl text-center'>
			<div className='w-52 h-52 flex mx-auto items-center justify-center'>
				<img src={imageUrl} alt={name + ' image'} className='max-h-full max-w-full' />
			</div>
			<h3>{name}</h3>
			<div className='font-medium font'>Cijena: {price}</div>
			<button
				className='mx-2 transition-colors duration-300 hover:border-blue-500 hover:border-4 hover:p-3 p-4 font-medium hover:from-white hover:to-white hover:text-blue-500 text-white bg-gradient-to-l from-blue-400 to-blue-500 shadow-md rounded-full border-0'
				onClick={editDetailsHandler}
			>
				Izmijeni proizvod ✏️
			</button>
            <button
				className='mx-2 transition-colors duration-300 hover:border-blue-500 hover:border-4 hover:p-3 p-4 font-medium hover:from-white hover:to-white hover:text-blue-500 text-white bg-gradient-to-l from-blue-400 to-blue-500 shadow-md rounded-full border-0'
				onClick={deleteHandler}
			>
				Obriši proizvod ❌
			</button>
		</div>
	);
}
