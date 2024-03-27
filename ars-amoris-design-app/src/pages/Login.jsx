import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const { login } = useAuth();

	async function handleSubmit() {
		try {
			setIsLoading(true);
			setError(null);
			await login(username, password);
			navigate('/');
		} catch (error) {
			setError(error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className='relative flex h-screen flex-col justify-center bg-blue-50'>
			<div className='z-10 mx-2 rounded bg-white px-7 py-8 shadow-md sm:mx-auto sm:w-[400px]'>
				<h1 className='mt-10 text-left text-2xl font-bold tracking-normal '>
					Dobrodošli nazad!
				</h1>
				<form
					onSubmit={e => {
						e.preventDefault();
						handleSubmit();
					}}
					className='mt-10 space-y-6'
				>
					<div>
						<label
							htmlFor='username'
							className='block text-sm font-medium text-slate-900'
						>
							Username
						</label>
						<div>
							<StyledInput
								value={username}
								onChange={e => setUsername(e.target.value)}
								autoFocus
								id='username'
							></StyledInput>
						</div>
					</div>
					<div>
						<label
							htmlFor='password'
							className='block text-sm font-medium text-slate-900'
						>
							Password
						</label>
						<div>
							<StyledInput
								value={password}
								onChange={e => setPassword(e.target.value)}
								type='password'
								id='password'
							></StyledInput>
						</div>
					</div>
					<div>
						<button
							type='submit'
							className='w-full rounded bg-blue-500 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
						>
							{isLoading ? (
								<>
									<LoadingIndicator />
									<span className='pl-1'>Molimo pričekajte...</span>
								</>
							) : (
								'Login'
							)}
						</button>
					</div>
					{error !== null && (
						<div className='text-center text-sm font-semibold text-red-500'>
							{error.response.status == 400
								? 'Neispravni podaci'
								: 'Nepoznata greška'}
						</div>
					)}
				</form>
			</div>
			<div className='z-10 mx-2 mt-4 rounded bg-slate-300 px-12 py-5 text-center font-normal text-slate-500 shadow-md sm:mx-auto sm:w-[400px]'>
				<h2>
					Nemaš račun?{' '}
					<a
						className='font-semibold text-slate-700 hover:text-slate-600'
						href='/createaccount'
					>
						Napravi ga!{' '}
					</a>
				</h2>
			</div>
			<div className='absolute bottom-0 h-96 w-full'>
				<div
					style={{
						background: `linear-gradient(to top,rgb(239,246,255,0.6), rgb(239,246,255)),url("data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 4 4'><path fill='#000000' fill-opacity='0.8' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'></path></svg>")}")`,
					}}
					className='absolute inset-0 '
				></div>
			</div>
		</div>
	);
}
function StyledInput({ ...rest }) {
	return (
		<input
			{...rest}
			className='mt-2 w-full rounded-sm border-0 bg-blue-50 px-2 py-1 shadow-sm outline outline-1 outline-slate-300 focus:outline-2 focus:outline-blue-500'
		></input>
	);
}
function LoadingIndicator() {
	return (
		<svg
			width='14'
			height='14'
			viewBox='0 0 24 24'
			className='relative bottom-0.5 inline animate-spin fill-blue-500'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z'
				fill='#ffffff'
			/>
			<path
				d='M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z'
				opacity={0.6}
			/>
		</svg>
	);
}
