/* eslint-disable react/prop-types */
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function Gallery({ images, objectFit = 'scale-down' }) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const currentImageRef = useRef(null);

	function showPrevious() {
		const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
		flushSync(() => setCurrentIndex(newIndex));
		currentImageRef.current.scrollIntoView({
			behavior: 'smooth',
			inline: 'center',
			block: 'nearest',
		});
	}
	function showNext() {
		const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
		flushSync(() => setCurrentIndex(newIndex));
		currentImageRef.current.scrollIntoView({
			behavior: 'smooth',
			inline: 'center',
			block: 'nearest',
		});
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
						className={`mx-auto inline h-full w-full ${objectFit === 'scale-down' ? 'object-scale-down' : 'object-cover'}`} // only scale-down or cover
					></img>
				))}
			</div>
			{images.length > 1 && (
				<>
					<button
						className='absolute left-0 top-[50%] -translate-y-[50%] p-2'
						onClick={showPrevious}
					>
						<ChevronLeft></ChevronLeft>
					</button>
					<button
						className='absolute right-0 top-[50%] -translate-y-[50%] p-2'
						onClick={showNext}
					>
						<ChevronRight></ChevronRight>
					</button>
					<div className='absolute bottom-0 left-[50%] flex -translate-x-[50%] gap-4 p-2'>
						{images.map((_, index) => (
							<div
								key={index}
								className={`h-1 w-8 rounded-sm ${index === currentIndex ? 'bg-slate-300' : 'bg-slate-700'}`}
							></div>
						))}
					</div>
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
			className='h-6 w-6 rounded-full bg-white/65 stroke-slate-900 pr-0.5 hover:stroke-slate-600'
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
			className='h-6 w-6 rounded-full bg-white/65 stroke-slate-900 pl-0.5 hover:stroke-slate-600'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='m8.25 4.5 7.5 7.5-7.5 7.5'
			/>
		</svg>
	);
}
