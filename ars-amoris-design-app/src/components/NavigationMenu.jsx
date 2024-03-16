/* eslint-disable react/prop-types */
import { useAuth } from '../contexts/AuthContext';
// import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

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
	const [isOpen, setIsOpen] = useState(false);

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
		<div className={`relative order-1 lg:order-2 ${isOpen ? 'menu-open' : ''}`}>
			<div
				className='grid h-full w-12 place-content-center hover:cursor-pointer hover:rounded-full hover:bg-slate-100 lg:hidden'
				onClick={() => setIsOpen(!isOpen)}
			>
				<MenuIcon></MenuIcon>
			</div>
			<nav
				className={`${isOpen ? 'no-scroll nav-menu-open' : '-translate-x-[100%] lg:translate-x-0'} absolute -left-4 z-50 h-screen w-[250px] bg-white font-medium transition-transform duration-300 lg:static lg:flex lg:h-fit lg:w-auto lg:justify-center`}
			>
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
		</div>
	);
}

// export const MemoNavigationMenu = memo(NavigationMenu);
function MenuIcon() {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={1.5}
			stroke='currentColor'
			className='h-6 w-6'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
			/>
		</svg>
	);
}
