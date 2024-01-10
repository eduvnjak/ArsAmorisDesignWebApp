import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import { memo } from 'react';

export default function AuthenticationMenu() {
	const { accessToken, isAuthenticated, logout } = useAuth();
	let text = 'Nisi ulogovan';
	
	if (accessToken !== null) {
		let decodedToken = jwtDecode(accessToken);
		text = 'Pozdrav ' + decodedToken.name + '!';
	}
	// console.log('auth menu render'); memo?
	// za ovo bolje mozda posebna stilizovana komponenta
	const divClassName = 'hover:text-blue-600 hover:bg-gradient-to-r from-gray-50  to-gray-100 m-5 p-3 rounded-md';
	return (
		<nav className='text-white font-medium p-2 flex justify-end w-fit'>
			{!isAuthenticated ? (
				<>
					<div className={divClassName}>
						<Link to='/login'>Log in</Link>
					</div>
					<div className={divClassName}>
						<Link to='/createaccount'>Create account</Link>
					</div>
				</>
			) : (
				<>
					<div className={divClassName}>{text}</div>
					<div className={divClassName}>
						<button
							onClick={() => {
								logout();
							}}
						>
							Log out
						</button>
					</div>
				</>
			)}
		</nav>
	);
}

// export const MemoAuthenticationMenu = memo(AuthenticationMenu);