import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	async function handleSubmit() {
		try {
			setLoading(true);
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
			setLoading(false);
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
						className='transition-all duration-300 my-3 shadow-md focus:outline-none focus:ring focus:ring-red-600'
						value={username}
						onChange={e => setUsername(e.target.value)}
					/>
				</label>
				<br />
				<label className='text-lg'>
					Password:{' '}
					<input
						className='transition-all duration-300 my-3 shadow-md focus:outline-none focus:ring focus:ring-red-600'
						value={password}
						type='password'
						onChange={e => setPassword(e.target.value)}
					/>
				</label>
				<br />
				<button
					type='submit'
					className='transition-colors duration-300 border-0 text-xl hover:border-red-500 hover:border-4 hover:p-3 mx-auto p-4 font-medium hover:from-white hover:to-white hover:text-red-500 text-white bg-gradient-to-l from-red-400 to-red-500 shadow-md rounded-full'
				>
					Login
				</button>
			</form>
			<div>
			</div>
			{isLoading && <div className='py-3 mx-auto w-fit text-white font-semibold'>Loading</div>}
			{error !== null && <div className='py-3 mx-auto w-fit text-white font-semibold'>{error}</div>}
		</>
	);
}
