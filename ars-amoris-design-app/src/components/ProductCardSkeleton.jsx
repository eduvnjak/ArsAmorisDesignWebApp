export default function ProductCardSkeleton() {
	const delay = Math.random() * 300;

	return (
		<div
			className='skeleton m-2 flex animate-pulse flex-col rounded bg-slate-50 p-0.5 shadow-2xl sm:flex-row'
			style={{ animationDelay: `${delay}ms` }}
		>
			<div className='h-64 shrink-0 bg-slate-300 sm:w-64'></div>
			<div className='flex grow flex-col justify-end gap-4 p-6'>
				<h2 className='h-[32px] w-[60%] bg-slate-300 font-bold sm:w-[296px]'></h2>
				<div className='flex items-baseline justify-between gap-1 px-2 sm:flex-col'>
					<span className='h-[20px] w-[100px] bg-slate-300 '></span>
					<span className='h-[24px] w-[90px] bg-slate-300 '></span>
				</div>
				<div className='mt-6 h-14 bg-slate-300'></div>
			</div>
		</div>
	);
}
