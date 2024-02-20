import { forwardRef } from 'react';
// children ili label prop?
const StyledInput = forwardRef(function StyledInput(
	{ children, ...rest },
	ref,
) {
	return (
		<label className='relative'>
			{children}
			<input
				className='m-2 p-1 shadow-md transition-all duration-300 placeholder:text-right focus:outline-none focus:ring focus:ring-blue-600'
				{...rest}
				ref={ref}
			/>
		</label>
	);
});

export default StyledInput;
