/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import LoadingIndicator from './LoadingIndicator';

export default function ProtectedRoute({ adminRoute, children }) {
	const { isAuthenticated, isAdmin, isLoading } = useAuth();
	const navigate = useNavigate();
	// console.log("protected render");

	useEffect(
		function () {
			// console.log('effect', isLoading, isAuthenticated, adminRoute, isAdmin);
			if (!isLoading && (!isAuthenticated || (adminRoute && !isAdmin))) navigate('/');
		},
		[isAuthenticated, isAdmin, isLoading, adminRoute, navigate]
	);

	return isLoading ? <LoadingIndicator /> : isAuthenticated && (!adminRoute || isAdmin) ? children : null;
}
