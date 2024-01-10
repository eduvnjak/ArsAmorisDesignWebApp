import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import { memo } from 'react';

export default function NavigationMenu() {
	const { isAdmin } = useAuth();
	// console.log('navmenu render');

	const navMenuRoutes = [
		{
			to: '/',
			text: 'Početna stranica',
		},
		{
			to: '/products',
			text: 'Proizvodi',
		},
		{
			to: '/about',
			text: 'About',
		},
	];

	return (
		<nav className='flex text-2xl font-medium text-white p-2 w-fit justify-start'>
			{navMenuRoutes.map((route, i) => {
				return (
					<div key={i}>
						<NavLink
							className={({ isActive, isPending }) =>
								isPending || isActive
									? 'transition-colors duration-500 text-blue-600 bg-gradient-to-r from-slate-50  to-slate-100 m-5 p-3 rounded-md inline-block'
									: 'transition-colors duration-500 hover:text-blue-600 hover:bg-gradient-to-r from-slate-50  to-slate-100 m-5 p-3 rounded-md inline-block'
							}
							to={route.to}
						>
							{route.text}
						</NavLink>
					</div>
				);
			})}
			{isAdmin && (
				<NavLink
					className={({ isActive, isPending }) =>
						isPending || isActive
							? 'transition-colors duration-500 text-blue-600 bg-gradient-to-r from-slate-50  to-slate-100 m-5 p-3 rounded-md inline-block'
							: 'transition-colors duration-500 hover:text-blue-600 hover:bg-gradient-to-r from-slate-50  to-slate-100 m-5 p-3 rounded-md inline-block'
					}
					to='/manage-products'
				>
					Upravljaj proizvodima{' '}
				</NavLink>
			)}
		</nav>
	);
}

// export const MemoNavigationMenu = memo(NavigationMenu);