import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import UpdatedArticlesPage from './pages/UpdatedArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ErrorPage from './pages/ErrorPage';
import './App.css';

// Modern React Router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'updated-articles',
        element: <UpdatedArticlesPage />,
      },
      {
        path: 'updated-article/:id',
        element: <ArticleDetailPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
