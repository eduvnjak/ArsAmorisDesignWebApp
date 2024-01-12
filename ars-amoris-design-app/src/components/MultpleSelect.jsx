import { useRef, useState } from 'react';

export default function MultipleSelect({ options, selectedOptions, onChange }) {
	const spanRef = useRef(null);
	const [isExpanded, setIsExpanded] = useState(false);

	function handleLabelClick() {
		spanRef.current.focus();
	}

	return (
		<>
			<span className='cursor-default' onClick={handleLabelClick}>
				Filtriraj po kategorijama:
			</span>
			<div className='cursor-default my-2 mx-1 text-left inline-block'>
				<span
					tabIndex={0}
					className='transition-all duration-300 pl-2 pr-1 py-1 bg-white shadow-md focus:outline-none focus:ring focus:ring-blue-600'
					onClick={() => setIsExpanded(!isExpanded)}
					onBlur={() => setIsExpanded(false)}
					onKeyDown={e => {
						e.preventDefault();
						if (e.code === 'Space') setIsExpanded(true);
						else if (e.key === 'Enter') setIsExpanded(!isExpanded);
					}}
					ref={spanRef}
				>
					Odaberi kategorije &nbsp;&nbsp;
					<svg
						className='inline-block'
						width='20px'
						height='20px'
						viewBox='-12 0 32 32'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<g id='SVGRepo_iconCarrier'>
							<path
								d='M6 9L12 15L18 9'
								stroke='#000000'
								strokeWidth='3'
								strokeLinecap='square'
								strokeLinejoin='miter'
							></path>
						</g>
					</svg>
				</span>
				{isExpanded && (
					<div className='absolute z-0'>
						{options.map(option => (
							<div key={option.id} className='bg-white p-2 hover:text-white hover:bg-blue-600'>
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
		</>
	);
}
