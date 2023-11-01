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

	return (
		<nav>
			{token === null ? (
				<>
					<div>
						<Link to='/login'>Log in</Link>
					</div>
					<div>
						<Link to='/createaccount'>Create account</Link>
					</div>
				</>
			) : (
				<>
					<div>{text}</div>
					<div>
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
