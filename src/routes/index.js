import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Header from '../components/header';

const routes = [
  { path: '/', element: await import('../pages/rooms') },
  { path: '/rooms', element: await import('../pages/rooms') },
  { path: '/order/:id', element: await import('../pages/order') },
  { path: '/login', element: await import('../pages/auth/login'), no_header: true },
  { path: '/register', element: await import('../pages/auth/register'), no_header: true },
  { path: '*', element: await import('../pages/404') }
];

export default createBrowserRouter([
  {
    path: '/',
    children: routes.map((r) => ({
      path: r.path,
      async lazy() {
        const Component = () => (
          <>
            {r.no_header ? null : <Header />}
            {r.element.default()}
          </>
        );
        return { Component };
      }
    }))
  }
]);
