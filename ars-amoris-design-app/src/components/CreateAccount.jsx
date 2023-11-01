import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');

	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	async function handleSubmit() {
		try {
			setLoading(true);
			if (username == '' || password == '' || password != confirmPassword) throw new Error('Invalid data');
			let response = await axios.post('https://localhost:7196/api/User/Register', {
				username: username,
				password: password,
			});
			console.log(response);
			setError(null);
			navigate('/login');
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
				</label>{' '}
				<br />
				<label>
					Password: <input value={password} type='password' onChange={e => setPassword(e.target.value)} />
				</label>
				<br />
				<label>
					Confirm password:{' '}
					<input value={confirmPassword} type='password' onChange={e => setConfirmPassword(e.target.value)} />
				</label>
				<br />
				<label>
					First name:{' '}
					<input value={firstName} placeholder='trenutno nevazno' onChange={e => setFirstName(e.target.value)} />
				</label>
				<br />
				<label>
					Last name:{' '}
					<input value={lastName} placeholder='trenutno nevazno' onChange={e => setLastName(e.target.value)} />
				</label>
				<br />
				<button type='submit'>Login</button>
			</form>
			{isLoading && <div id='loading'>Loading</div>}
			{error !== null && <div id='error'>{error}</div>}
		</>
	);
}
