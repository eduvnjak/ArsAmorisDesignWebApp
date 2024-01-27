/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const initialState = {
	accessToken: null,
	isAuthenticated: false,
	isAdmin: false,
	isLoading: true,
};

function reducer(state, action) {
	// console.log(action.type);

	switch (action.type) {
		case 'login':
			return {
				...state,
				accessToken: action.accessToken,
				isAuthenticated: true,
				isAdmin: action.isAdmin,
			};
		case 'logout':
			return { ...state, accessToken: null, isAuthenticated: false, isAdmin: false };
		case 'loading':
			return { ...state, isLoading: true };
		case 'finished':
			return { ...state, isLoading: false };
		default:
			throw new Error('Unknown action');
	}
}
function AuthProvider({ children }) {
	const [{ accessToken, isAuthenticated, isAdmin, isLoading }, dispatch] = useReducer(reducer, initialState);

	async function login(username, password) {
		dispatch({ type: 'loading' });

		try {
			let response = await axios.post(
				`${import.meta.env.VITE_API_URL}Auth/Login`,
				{
					username,
					password,
				},
				{ withCredentials: true }
			);
			if (response.status === 200) {
				const decoded = jwtDecode(response.data.accessToken);
				dispatch({ type: 'login', accessToken: response.data.accessToken, isAdmin: decoded.isAdmin === 'true' });
			}
		} finally {
			dispatch({ type: 'finished' });
		}
	}

	async function logout() {
		dispatch({ type: 'loading' });
		await axios.post(`${import.meta.env.VITE_API_URL}Auth/Token/logout`, null, { withCredentials: true });
		dispatch({ type: 'logout' });
		dispatch({ type: 'finished' });
	}

	async function refresh() {
		try {
			dispatch({ type: 'loading' });

			let response = await axios.post(`${import.meta.env.VITE_API_URL}Auth/Token/refresh`, null, {
				withCredentials: true,
			});
			if (response.status === 200) {
				const decoded = jwtDecode(response.data.accessToken);
				dispatch({ type: 'login', accessToken: response.data.accessToken, isAdmin: decoded.isAdmin === 'true' });
			}
		} catch (error) {
			// ignorisi 401
			if(error.response.status !== 401) throw error;
		} finally {
			dispatch({ type: 'finished' });
		}
	}

	useEffect(function () {
		refresh();
	}, []);

	return (
		<AuthContext.Provider value={{ accessToken, isAuthenticated, isAdmin, isLoading, login, logout, refresh }}>
			{children}
		</AuthContext.Provider>
	);
}

function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) throw new Error('AuthContex was used outside of AuthProvider');
	return context;
}

export { AuthProvider, useAuth };
