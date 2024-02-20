// ovo bi se moglo izdvojiti kao posebna modal komponenta a onda sadrzaj kroz children i props
import Button from './Button';

export default function DeleteModal({ name, confirmOnClick, declineOnClick }) {
	return (
		<div
			className='no-scroll fixed top-0 z-50 grid h-screen w-screen place-items-center overflow-y-auto backdrop-blur-sm'
			onClick={declineOnClick}
		>
			<div
				className='w-52 rounded border bg-slate-50 p-4 shadow-md sm:w-[300px]'
				onClick={e => e.stopPropagation()}
			>
				<span className='text-center'>
					Da li ste sigurni da želite obrisati{' '}
					<span className='font-bold'>{name}</span>?
				</span>
				<div className='flex flex-col gap-2 p-2'>
					<Button onClick={confirmOnClick}>Da</Button>
					<Button onClick={declineOnClick}>Ne</Button>
				</div>
			</div>
		</div>
	);
}
