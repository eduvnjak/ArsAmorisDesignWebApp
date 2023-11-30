import { useState } from 'react';

export default function MultipleSelect({ options, selectedOptions, onChange }) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className='cursor-default m-2 text-left inline-block '>
			<span className='p-2 bg-white shadow-md' onClick={() => setIsExpanded(!isExpanded)}>
				Odaberi kategoriju
				<svg
					className='inline-block'
					width='16px'
					height='16px'
					viewBox='0 0 24 24'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<g id='SVGRepo_iconCarrier'>
						<path
							d='M6 9L12 15L18 9'
							stroke='#000000'
							strokeWidth='3'
							strokeLinecap='round'
							strokeLinejoin='round'
						></path>{' '}
					</g>
				</svg>
			</span>
			{isExpanded && (
				<div className='absolute z-0'>
					{options.map(option => (
						<div key={option.id} className='bg-white p-2 hover:text-white hover:bg-blue-600 '>
							<label className='hover:cursor-pointer'>
								{option.name}{' '}
								<input
									className='hover:cursor-pointer'
									type='checkbox'
									checked={selectedOptions.includes(option.id)}
									onChange={() => onChange(option.id)}
								></input>
							</label>
						</div>
					))}
					<div className='bg-white p-2 hover:text-white hover:bg-blue-600'>
						<label className='hover:cursor-pointer'>
							Bez kategorije{' '}
							<input
								className='hover:cursor-pointer'
								type='checkbox'
								onChange={() => onChange('null')}
								checked={selectedOptions.includes('null')}
							></input>
						</label>
					</div>
				</div>
			)}
		</div>
	);
}
