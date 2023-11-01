import { Link } from 'react-router-dom';

export default function NavigationMenu() {
	return (
		<nav>
			<div>
				<Link to='/'>Početna stranica</Link>
			</div>
			<div>
				<Link to='/products'>Proizvodi</Link>
			</div>
			<div>
				<Link to='/about'>About</Link>
			</div>
		</nav>
	);
}
