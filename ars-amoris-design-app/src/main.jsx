import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from './Root.jsx';
import './index.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from './components/Login.jsx';
import CreateAccount from './components/CreateAccount.jsx';
import FeaturedProducts, { loader as featuredProductsLoader } from './components/FeaturedProducts.jsx';
import Products from './components/Products.jsx';
import About from './components/About.jsx';
import ProductDetails from './components/ProductDetails.jsx';
import ManageProducts, { loader as manageProductsLoader } from './components/ManageProducts.jsx';
import EditProductDetails from './components/EditProductDetails.jsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		children: [
			{ index: true, element: <FeaturedProducts />, loader: featuredProductsLoader },
			{ path: 'about', element: <About /> },
			{ path: 'products', element: <Products /> },
			{ path: 'products/:productId', element: <ProductDetails /> },
			{ path: 'manage-products/', element: <ManageProducts />, loader: manageProductsLoader },
			{ path: 'manage-products/:productId', element: <EditProductDetails /> },
		],
	},
	{ path: '/login', element: <Login /> },
	{ path: '/createaccount', element: <CreateAccount /> },
]);
ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
