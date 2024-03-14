import { useAuth } from '../contexts/AuthContext';
// import { memo } from 'react';
import { NavLink } from 'react-router-dom';

// ova komponenta se nigdje drugo ne koristi stoga je ostavljena u ovom fajlu; izdvojena radi preglednosti
function NavigationMenuElement({ children, to }) {
	return (
		<div>
			<NavLink
				className={({ isActive, isPending }) =>
					isPending || isActive
						? 'block text-nowrap border-b-4 border-blue-600 p-3 text-blue-700 transition-colors duration-300'
						: 'relative block text-nowrap p-3 text-slate-500 transition-colors duration-300 before:absolute before:-bottom-1 before:left-[50%] before:h-1 before:w-0 before:bg-blue-600 before:transition-all before:duration-300 hover:text-slate-700 hover:before:left-0 hover:before:w-[100%] hover:after:right-0 hover:after:w-[100%]'
				}
				to={to}
			>
				{children}
			</NavLink>
		</div>
	);
}

export default function NavigationMenu() {
	const { isAdmin } = useAuth();

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
		{
			to: '/test',
			text: 'Test',
		},
	];

	return (
		<nav className='col-start-2 flex justify-center font-medium'>
			{navMenuRoutes.map((route, i) => {
				return (
					<NavigationMenuElement key={i} to={route.to}>
						{route.text}
					</NavigationMenuElement>
				);
			})}
			{isAdmin && (
				<NavigationMenuElement to='/manage-products'>
					Upravljaj proizvodima
				</NavigationMenuElement>
			)}
		</nav>
	);
}

// export const MemoNavigationMenu = memo(NavigationMenu);
