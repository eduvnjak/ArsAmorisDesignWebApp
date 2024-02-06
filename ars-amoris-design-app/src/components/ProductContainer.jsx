export default function ProductContainer({ children }) {
	return (
		<div className='flex flex-col flex-wrap justify-center px-2 sm:grid sm:grid-cols-[repeat(auto-fill,620px)] sm:px-0'>
			{children}
		</div>
	);
}
