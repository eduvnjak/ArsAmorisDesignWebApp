export default function Button({ children, type = 'button', ...rest }) {
	// reusable styled button
	return (
		<button
			className='w-[100%] rounded border-0 bg-gradient-to-l from-blue-400 to-blue-500 p-4 font-medium text-white shadow-md transition-colors duration-300 hover:border-4 hover:border-blue-500 hover:from-white hover:to-white hover:p-3 hover:text-blue-500'
			type={type}
			{...rest}
		>
			{children}
		</button>
	);
}
