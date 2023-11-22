import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function AuthenticationMenu() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const token = localStorage.getItem('token');
	let text = 'Nisi ulogovan';
	let username = null;
	if (token !== null) {
		let decodedToken = jwtDecode(token);
		console.log(decodedToken);
		username = decodedToken.name;
		text = 'Pozdrav ' + username + '!';
	}

	// za ovo bolje mozda posebna stilizovana komponenta 
	const divClassName = 'hover:text-blue-600 hover:bg-gradient-to-r from-gray-50  to-gray-100 m-5 p-3 rounded-md';
	return (
		<nav className='text-white font-medium p-2 flex justify-end w-fit'>
			{token === null ? (
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
								localStorage.removeItem('token');
								setIsLoggedIn(!isLoggedIn); // los nacin za rerender
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
