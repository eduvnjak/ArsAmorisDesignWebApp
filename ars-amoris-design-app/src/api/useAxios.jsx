import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useMemo } from 'react';

export default function useAxios() {
	const { isAuthenticated, accessToken } = useAuth();

	const axiosInstance = useMemo(
		() =>
			axios.create({
				baseURL: import.meta.env.VITE_API_URL,
				...(isAuthenticated && {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}),
			}),
		[isAuthenticated, accessToken],
	);

	/* 	useEffect(() => {
		const requestInterceptor = axiosInstance.interceptors.request.use(
			config => {
				if (!config.headers['Authorization']) {
					if (isAuthenticated) {
						config.headers['Authorization'] = `Bearer ${accessToken}`;
					}
				}
				return config;
			},
			error => Promise.reject(error),
		);

		return () => {
			axiosInstance.interceptors.request.eject(requestInterceptor);
		};
	}, [isAuthenticated, accessToken, axiosInstance]);
 */

	return axiosInstance;
}
