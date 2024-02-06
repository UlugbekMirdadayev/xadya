import React, { Suspense, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import routes from './routes';
import { useUser } from './redux/selectors';
import Header from 'components/header';

const App = () => {
  const user = useUser();
  const [activeUser, setActiveUser] = useState(true);

  useEffect(() => {
    if (user?.active === 0) {
      setActiveUser(false);
    } else {
      setActiveUser(true);
    }
  }, [user?.active]);

  return (
    <div className="container" style={!activeUser ? { overflow: 'hidden', height: '100dvh' } : undefined}>
      <Header />
      <Suspense fallback={<div className="lds-dual-ring app-loader" />}>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
