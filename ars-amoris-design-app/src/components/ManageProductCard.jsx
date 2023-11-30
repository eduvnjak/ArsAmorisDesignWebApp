import Button from './Button';

export default function ManageProductCard({ name, price, imageUrl, categoryName, editDetailsHandler, deleteHandler }) {
	return (
		<div className='m-2 bg-slate-50 rounded-xl p-3 shadow-2xl text-center'>
			<div className='w-52 h-52 flex mx-auto items-center justify-center'>
				<img src={imageUrl} alt={name + ' image'} className='max-h-full max-w-full' />
			</div>
			<h3>{name}</h3>
			<div className='font-medium font'>Cijena: {price}</div>
			<div className='font-medium font'>{categoryName ?? 'Nekategorisan'}</div>
			<div className='flex gap-3'>
				<Button onClick={editDetailsHandler}> Izmijeni proizvod ✏️</Button>
				<Button onClick={deleteHandler}> Obriši proizvod ❌</Button>
			</div>
		</div>
	);
}
