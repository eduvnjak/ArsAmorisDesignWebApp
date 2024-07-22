import { useEffect, useRef, useState } from 'react';

export default function MultipleSelect({ options, selectedOptions, onChange }) {
	const divRef = useRef(null);
	const dropdownRef = useRef(null);
	const hoveredRef = useRef(false);

	const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {
		if (dropdownRef.current != null) {
			dropdownRef.current.style.width = `${divRef.current.offsetWidth}px`;
		}
	}, [isExpanded]);

	let selectedCounter = 0;
	selectedOptions.forEach(option => {
		options.some(o => o.id === option) && selectedCounter++;
	});
	return (
		<>
			<span className='cursor-default' onClick={() => divRef.current.focus()}>
				Filtriraj po kategorijama:
			</span>
			<div
				className='m-2 inline-block cursor-default text-left'
				onMouseEnter={() => {
					hoveredRef.current = true;
				}}
				onMouseLeave={() => {
					hoveredRef.current = false;
				}}
				onBlurCapture={() => {
					if (!hoveredRef.current) setIsExpanded(false);
				}}
			>
				<div
					tabIndex={0} // ovaj span srediti
					className='flex w-48 items-end justify-between bg-white py-1 pl-2 pr-1 shadow-md transition-all duration-300 focus:outline-none focus:ring focus:ring-blue-600'
					onClick={() => setIsExpanded(!isExpanded)}
					onKeyDown={e => {
						e.preventDefault();
						if (e.code === 'Space') setIsExpanded(true);
						else if (e.key === 'Enter') setIsExpanded(!isExpanded);
					}}
					ref={divRef}
				>
					<span>
						{selectedCounter === 0
							? 'Odaberi kategorije'
							: `Odabrano: ${selectedCounter}`}
					</span>
					<Chevron />
				</div>
				{isExpanded && (
					<div className='absolute z-10' ref={dropdownRef}>
						{options.map(option => (
							<DropDownElement
								key={option.id}
								name={option.name}
								checked={selectedOptions.includes(option.id)}
								onChange={() => onChange(option.id)}
							/>
						))}
						<DropDownElement
							name={'Bez kategorije'}
							checked={selectedOptions.includes('null')}
							onChange={() => onChange('null')}
						/>
					</div>
				)}
			</div>
		</>
	);
}
// nisu exportovane, komponente izdvojene radi preglednosti
function DropDownElement({ name, checked, onChange }) {
	return (
		<div className='border-x bg-white p-2 first:border-t last:border-b hover:bg-blue-600 hover:text-white'>
			<label className='flex hover:cursor-pointer'>
				<span className='inline-block flex-grow'>{name}</span>
				<input
					className='hover:cursor-pointer'
					type='checkbox'
					checked={checked}
					onChange={onChange}
				></input>
			</label>
		</div>
	);
}

function Chevron() {
	return (
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
	);
}
