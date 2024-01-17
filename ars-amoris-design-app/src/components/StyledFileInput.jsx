export default function StyledFileInput({ children, ...rest }) {
	return (
		<label>
			{children}
			<input
				type='file'
				className='file:transition-colors file:mt-2 file:cursor-pointer
             file:duration-300 file:hover:border-blue-500 file:hover:border-solid file:hover:border-4
              file:hover:p-3 file:p-4 file:font-medium file:hover:from-white
               file:hover:to-white file:hover:text-blue-500 file:text-white
                file:bg-gradient-to-l file:from-blue-400 file:to-blue-500
                 file:shadow-md file:rounded-full file:border-0 file:border-blue-500'
				{...rest}
			></input>
		</label>
	);
}
