import Root from './Root.jsx';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from './pages/Login.jsx';
import CreateAccount from './pages/CreateAccount.jsx';
import FeaturedProducts, {
	loader as featuredProductsLoader,
} from './pages/FeaturedProducts.jsx';
import Products from './pages/Products.jsx';
import About from './pages/About.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import ManageProducts, {
	loader as manageProductsLoader,
} from './pages/ManageProducts.jsx';
import EditProductDetails from './pages/EditProductDetails.jsx';
import AddNewProduct from './pages/AddNewProduct.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import useAxios from './api/useAxios.jsx';

export default function App() {
	const axiosInstance = useAxios();

	const router = createBrowserRouter([
		{
			path: '/',
			element: <Root />,
			children: [
				{
					index: true,
					element: <FeaturedProducts />,
					loader: () => featuredProductsLoader(axiosInstance),
				},
				{ path: 'about', element: <About /> },
				{ path: 'products', element: <Products /> },
				{ path: 'products/:productId', element: <ProductDetails /> },
				{
					path: 'manage-products/',
					element: (
						<ProtectedRoute adminRoute={true}>
							<ManageProducts />
						</ProtectedRoute>
					),
					loader: () => manageProductsLoader(axiosInstance),
				},
				{
					path: 'manage-products/:productId',
					element: (
						<ProtectedRoute adminRoute={true}>
							<EditProductDetails />
						</ProtectedRoute>
					),
				},
				{
					path: 'manage-products/new',
					element: (
						<ProtectedRoute adminRoute={true}>
							<AddNewProduct />
						</ProtectedRoute>
					),
				},
			],
		},
		{ path: '/login', element: <Login /> },
		{ path: '/createaccount', element: <CreateAccount /> },
	]);

	return <RouterProvider router={router} />;
}
