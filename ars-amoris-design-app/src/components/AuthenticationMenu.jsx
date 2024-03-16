/* eslint-disable react/prop-types */
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';
// import { memo } from 'react';
import { Link } from 'react-router-dom';

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
		<span className='mx-2 h-[1.5rem] w-[1px] translate-y-3 bg-slate-300'></span>
	);
}

export default function AuthenticationMenu() {
	const { accessToken, isAuthenticated, logout } = useAuth();
	let text = 'Nisi ulogovan';

	if (accessToken !== null) {
		let decodedToken = jwtDecode(accessToken);
		text = 'Pozdrav ' + decodedToken.name + '!';
	}
	// console.log('auth menu render'); memo?

	return (
		<nav className='ml-auto flex justify-center font-medium order-3'>
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
					<div className='inline-block rounded-md p-3'>{text}</div>
					<Divider />
					<div
						className='inline-block rounded-md p-3 transition-colors duration-300 hover:cursor-pointer hover:text-blue-600'
						onClick={() => {
							logout();
						}}
					>
						Log out
					</div>
				</>
			)}
		</nav>
	);
}

// export const MemoAuthenticationMenu = memo(AuthenticationMenu);
