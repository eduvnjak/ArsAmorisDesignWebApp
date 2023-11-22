export default function Button({ onClick, children, type = 'button' }) {
	// reusable styled button
	return (
		<button
			className='transition-colors duration-300 hover:border-blue-500 hover:border-4 hover:p-3 p-4 font-medium hover:from-white hover:to-white hover:text-blue-500 text-white bg-gradient-to-l from-blue-400 to-blue-500 shadow-md rounded-full border-0'
			onClick={onClick}
            type={type}
		>
			{children}
		</button>
	);
}
