import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Header from '../components/header';

const routes = [
  { path: '/', element: await import('../pages/rooms') },
  { path: '/rooms', element: await import('../pages/rooms') },
  { path: '/order/:id', element: await import('../pages/order') },
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
            <Header />
            {r.element.default()}
          </>
        );
        return { Component };
      }
    }))
  }
]);
