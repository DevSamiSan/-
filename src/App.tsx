import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import { BuildProvider } from './state/build';

const Home = lazy(() => import('./pages/Home'));
const Builder = lazy(() => import('./pages/Builder'));
const Parts = lazy(() => import('./pages/Parts'));
const PartDetail = lazy(() => import('./pages/PartDetail'));
const Compare = lazy(() => import('./pages/Compare'));
const Builds = lazy(() => import('./pages/Builds'));
const Guides = lazy(() => import('./pages/Guides'));
const GuideDetail = lazy(() => import('./pages/GuideDetail'));
const Assistant = lazy(() => import('./pages/Assistant'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/build', element: <Builder /> },
      { path: '/builds', element: <Builds /> },
      { path: '/parts', element: <Parts /> },
      { path: '/parts/:category', element: <Parts /> },
      { path: '/part/:id', element: <PartDetail /> },
      { path: '/compare', element: <Compare /> },
      { path: '/guides', element: <Guides /> },
      { path: '/guides/:slug', element: <GuideDetail /> },
      { path: '/assistant', element: <Assistant /> },
      { path: '/about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <BuildProvider>
      <RouterProvider router={router} />
    </BuildProvider>
  );
}
