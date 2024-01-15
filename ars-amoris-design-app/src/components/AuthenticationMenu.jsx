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
					'transition-colors duration-500 hover:text-blue-600 hover:bg-gradient-to-r from-slate-50  to-slate-100 m-5 p-3 rounded-md inline-block'
				}
			>
				{children}
			</Link>
		</div>
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
		<nav className='text-white font-medium p-2 flex justify-end w-fit'>
			{!isAuthenticated ? (
				<>
					<AuthenticationMenuElement to='/login'>Log in</AuthenticationMenuElement>
					<AuthenticationMenuElement to='/createaccount'>Create account</AuthenticationMenuElement>
				</>
			) : (
				<>
					<div className='from-slate-50  to-slate-100 m-5 p-3 rounded-md inline-block'>{text}</div>
					<div
						className='transition-colors duration-500 hover:text-blue-600 hover:bg-gradient-to-r hover:cursor-pointer from-slate-50  to-slate-100 m-5 p-3 rounded-md inline-block'
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