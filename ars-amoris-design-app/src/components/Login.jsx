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
			>
				<label>
					Username: <input value={username} onChange={e => setUsername(e.target.value)} />
				</label>
				<br />
				<label>
					Password: <input value={password} type='password' onChange={e => setPassword(e.target.value)} />
				</label>
				<br />
				<button type='submit'>Login</button>
			</form>
			{isLoading && <div id='loading'>Loading</div>}
			{error !== null && <div id='error'>{error}</div>}
		</>
	);
}
