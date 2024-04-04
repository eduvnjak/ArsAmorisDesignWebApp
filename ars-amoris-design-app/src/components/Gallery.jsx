/* eslint-disable react/prop-types */
import { useState } from 'react';

export default function Gallery({ images }) {
	const [currentIndex, setCurrentIndex] = useState(0);

	function showPrevious() {
		if (currentIndex !== 0) setCurrentIndex(currentIndex - 1);
	}
	function showNext() {
		if (currentIndex !== images.length - 1) setCurrentIndex(currentIndex + 1);
	}
	return (
		<div className='relative flex h-full w-full justify-center'>
			<img src={images[currentIndex]} className='object-cover'></img>
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

// import { useRef } from 'react';

// export function CatFriends() {
//   const itemsRef = useRef(null);

//   function scrollToId(itemId) {
//     const map = getMap();
//     const node = map.get(itemId);
//     node.scrollIntoView({
//       behavior: 'smooth',
//       block: 'nearest',
//       inline: 'center'
//     });
//   }

//   function getMap() {
//     if (!itemsRef.current) {
//       // Initialize the Map on first usage.
//       itemsRef.current = new Map();
//     }
//     return itemsRef.current;
//   }

//   return (
//     <>
//       <nav>
//         <button onClick={() => scrollToId(0)}>
//           Tom
//         </button>
//         <button onClick={() => scrollToId(5)}>
//           Maru
//         </button>
//         <button onClick={() => scrollToId(9)}>
//           Jellylorum
//         </button>
//       </nav>
//       <div>
//         <ul>
//           {catList.map(cat => (
//             <li
//               key={cat.id}
//               ref={(node) => {
//                 const map = getMap();
//                 if (node) {
//                   map.set(cat.id, node);
//                 } else {
//                   map.delete(cat.id);
//                 }
//               }}
//             >
//               <img
//                 src={cat.imageUrl}
//                 alt={'Cat #' + cat.id}
//               />
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// }

// const catList = [];
// for (let i = 0; i < 10; i++) {
//   catList.push({
//     id: i,
//     imageUrl: 'https://placekitten.com/250/200?image=' + i
//   });
// }

