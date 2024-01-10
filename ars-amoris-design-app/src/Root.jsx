import { Outlet, useNavigation } from 'react-router-dom';
import NavigationMenu from './components/NavigationMenu';
import AuthenticationMenu from './components/AuthenticationMenu';
import LoadingIndicator from './components/LoadingIndicator';

function Root() {
	const { state } = useNavigation();
	// console.log('root render');
	
	return (
		<>
			<div className='flex justify-between bg-gradient-to-b from-blue-900 to-blue-600 overflow-auto'>
				<NavigationMenu />
				<AuthenticationMenu />
			</div>
			{state === 'loading' ? <LoadingIndicator /> : <Outlet />}
		</>
	);
}

export default Root;
