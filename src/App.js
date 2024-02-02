import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import routes from './routes';

const App = () => {
  return (
    <div className="container">
      <Suspense fallback={<>Loading...</>}>
        <RouterProvider router={routes} />
      </Suspense>
    </div>
  );
};

export default App;
