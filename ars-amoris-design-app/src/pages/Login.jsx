import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import LoadingIndicator from '../components/LoadingIndicator';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	async function handleSubmit() {
		try {
			setIsLoading(true);
			setError(null);
			let response = await axios.post('https://localhost:7196/api/User/Login', {
				username: username,
				password: password,
			});
			localStorage.setItem('token', response.data.token);
			console.log(response.data.token);
			setError(null);
			navigate('/');
		} catch (error) {
			setError(error.message);
			console.log(error.message);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			<form
				onSubmit={e => {
					e.preventDefault();
					handleSubmit();
				}}
				className='shadow-md text-center w-fit mx-auto mt-52 p-5 bg-slate-50 rounded-3xl'
			>
				<label className='text-lg font-normal'>
					Username:{' '}
					<input
						className='transition-all duration-300 my-3 shadow-md focus:outline-none focus:ring focus:ring-blue-600'
						value={username}
						onChange={e => setUsername(e.target.value)}
					/>
				</label>
				<br />
				<label className='text-lg'>
					Password:{' '}
					<input
						className='transition-all duration-300 my-3 shadow-md focus:outline-none focus:ring focus:ring-blue-600'
						value={password}
						type='password'
						onChange={e => setPassword(e.target.value)}
					/>
				</label>
				<br />
				<Button type='submit'>
					<span className='text-xl'>Login</span>
				</Button>
			</form>
			{/* {isLoading && <div className='py-3 mx-auto w-fit text-white font-semibold'>Loading</div>} */}
			{isLoading && <LoadingIndicator />}
			{error !== null && <div className='py-3 mx-auto w-fit text-white font-semibold'>{error}</div>}
		</>
	);
}
