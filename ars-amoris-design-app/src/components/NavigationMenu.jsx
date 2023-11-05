import { Link } from 'react-router-dom';

export default function NavigationMenu() {
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
					<div key={i} className='transition-colors duration-500 hover:text-red-600 hover:bg-gradient-to-r from-gray-50  to-gray-100 m-5
					p-3 rounded-md'>
						<Link to={route.to}>{route.text}</Link>
					</div>
				);
			})}
		</nav>
	);
}
