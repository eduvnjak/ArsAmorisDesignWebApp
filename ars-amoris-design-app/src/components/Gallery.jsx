/* eslint-disable react/prop-types */
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function Gallery({ images }) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const currentImageRef = useRef(null);

	function showPrevious() {
		if (currentIndex !== 0) {
			flushSync(() => setCurrentIndex(currentIndex - 1));
			currentImageRef.current.scrollIntoView({
				behavior: 'smooth',
				inline: 'center',
				block: 'center',
			});
		}
	}
	function showNext() {
		if (currentIndex !== images.length - 1) {
			flushSync(() => setCurrentIndex(currentIndex + 1));
			currentImageRef.current.scrollIntoView({
				behavior: 'smooth',
				inline: 'center',
				block: 'center',
			});
		}
	}
	return (
		<div className='relative h-full w-full'>
			<div className='h-full overflow-hidden whitespace-nowrap'>
				{images.map((image, index) => (
					<img
						key={index}
						ref={index === currentIndex ? currentImageRef : null}
						src={image}
						alt={'image ' + index}
						className='mx-auto inline h-full w-full object-scale-down'
					></img>
				))}
			</div>
			{images.length > 1 && (
				<>
					<button
						className='group absolute left-0 top-[50%] -translate-y-[50%] p-2'
						onClick={showPrevious}
						disabled={currentIndex === 0}
					>
						<ChevronLeft></ChevronLeft>
					</button>
					<button
						className='group absolute right-0 top-[50%] -translate-y-[50%] p-2'
						onClick={showNext}
						disabled={currentIndex === images.length - 1}
					>
						<ChevronRight></ChevronRight>
					</button>
				</>
			)}
		</div>
	);
}

function ChevronLeft() {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={1.5}
			stroke='currentColor'
			className='h-10 w-10 rounded-full bg-white/65 stroke-slate-900 pr-1 hover:stroke-slate-600 group-disabled:bg-transparent group-disabled:hover:stroke-slate-900'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M15.75 19.5 8.25 12l7.5-7.5'
			/>
		</svg>
	);
}
function ChevronRight() {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={1.5}
			stroke='currentColor'
			className='h-10 w-10 rounded-full bg-white/65 stroke-slate-900 pl-1 hover:stroke-slate-600 group-disabled:bg-transparent group-disabled:hover:stroke-slate-900'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='m8.25 4.5 7.5 7.5-7.5 7.5'
			/>
		</svg>
	);
}
