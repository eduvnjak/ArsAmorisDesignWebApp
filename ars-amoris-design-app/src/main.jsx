import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from './Root.jsx';
import './index.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from './pages/Login.jsx';
import CreateAccount from './pages/CreateAccount.jsx';
import FeaturedProducts, { loader as featuredProductsLoader } from './pages/FeaturedProducts.jsx';
import Products from './pages/Products.jsx';
import About from './pages/About.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import ManageProducts, { loader as manageProductsLoader } from './pages/ManageProducts.jsx';
import EditProductDetails from './pages/EditProductDetails.jsx';
import AddNewProduct from './pages/AddNewProduct.jsx';

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
			{ path: 'manage-products/new', element: <AddNewProduct /> },
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
