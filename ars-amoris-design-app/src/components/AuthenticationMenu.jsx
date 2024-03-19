/* eslint-disable react/prop-types */
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';
// import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

// ova komponenta se nigdje drugo ne koristi stoga je ostavljena u ovom fajlu; izdvojena radi preglednosti
function AuthenticationMenuElement({ children, to }) {
	return (
		<div>
			<Link
				to={to}
				className={
					'block rounded-md p-3 transition-colors duration-300 hover:text-blue-600'
				}
			>
				{children}
			</Link>
		</div>
	);
}

function Divider() {
	return (
		<span className='mx-2 hidden h-[1.5rem] w-[1px] translate-y-3 bg-slate-300 md:inline'></span>
	);
}

export default function AuthenticationMenu() {
	const { accessToken, isAuthenticated, logout } = useAuth();
	let greeting = 'Nisi ulogovan';

	if (accessToken !== null) {
		let decodedToken = jwtDecode(accessToken);
		greeting = 'Pozdrav ' + decodedToken.name + '!';
	}
	// console.log('auth menu render'); memo?
	const [isOpen, setIsOpen] = useState(false);

	const menuRef = useRef(null);
	useEffect(() => {
		function handleClickOutsideMenu(event) {
			if (
				isOpen &&
				menuRef.current &&
				!menuRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener('click', handleClickOutsideMenu, true);
		return () => {
			document.removeEventListener('click', handleClickOutsideMenu, true);
		};
	}, [menuRef, isOpen]);

	return (
		<div className='relative order-3 ml-auto' ref={menuRef}>
			<div
				className='grid h-full w-12 place-content-center hover:cursor-pointer hover:rounded-full hover:bg-slate-100 md:hidden'
				onClick={() => setIsOpen(!isOpen)}
			>
				<MenuIcon></MenuIcon>
			</div>
			<nav
				className={`${isOpen ? 'opacity-100' : 'opacity-0 invisible'} absolute right-0 translate-y-1 justify-center divide-y text-nowrap rounded bg-slate-50 text-center font-medium shadow-md transition-all duration-300 md:visible md:static md:right-0 md:flex md:translate-y-0 md:divide-y-0 md:rounded-none md:bg-white md:opacity-100 md:shadow-none`}
			>
				{!isAuthenticated ? (
					<>
						<AuthenticationMenuElement to='/login'>
							Log in
						</AuthenticationMenuElement>
						<Divider />
						<AuthenticationMenuElement to='/createaccount'>
							Create your account
						</AuthenticationMenuElement>
					</>
				) : (
					<>
						<div className='block rounded-md p-3'>{greeting}</div>
						<Divider />
						<div
							className='block rounded-md p-3 transition-colors duration-300 hover:cursor-pointer hover:text-blue-600'
							onClick={() => {
								logout();
							}}
						>
							Log out
						</div>
					</>
				)}
			</nav>
		</div>
	);
}

// export const MemoAuthenticationMenu = memo(AuthenticationMenu);
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
				d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
			/>
		</svg>
	);
}
