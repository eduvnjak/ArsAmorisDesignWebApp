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
						? 'transition-colors duration-500 text-blue-600 bg-gradient-to-r from-slate-50  to-slate-100 m-5 p-3 rounded-md inline-block'
						: 'transition-colors duration-500 hover:text-blue-600 hover:bg-gradient-to-r from-slate-50  to-slate-100 m-5 p-3 rounded-md inline-block'
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
	];

	return (
		<nav className='flex text-2xl font-medium text-white p-2 w-fit justify-start'>
			{navMenuRoutes.map((route, i) => {
				return (
					<NavigationMenuElement key={i} to={route.to}>
						{route.text}
					</NavigationMenuElement>
				);
			})}
			{isAdmin && <NavigationMenuElement to='/manage-products'>Upravljaj proizvodima</NavigationMenuElement>}
		</nav>
	);
}

// export const MemoNavigationMenu = memo(NavigationMenu);
