// children ili label prop?
export default function StyledInput({ children, ...rest }) {
	return (
		<label>
			{children}
			<input
				className='transition-all duration-300 m-2 p-1 shadow-md focus:outline-none focus:ring focus:ring-blue-600'
				{...rest}
			/>
		</label>
	);
}
