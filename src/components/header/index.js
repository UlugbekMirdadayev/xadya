import React, { useEffect, useState } from 'react';
import './style.css';
import { NavLink } from 'react-router-dom';
import { useLocaleOrders } from '../../redux/selectors';

const links = [
  { label: 'Joylar royxati', to: '/rooms' },
  { label: 'Olib ketishga', to: '/self' },
  { label: 'Buyurmalar royxati', to: '/orders' }
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const localeOrders = useLocaleOrders();
  const logger = () => {
    console.log(localeOrders);
  };
  useEffect(() => {
    logger();
  }, [localeOrders]);

  return (
    <header>
      {open && (
        <div className="modal">
          <ul className="list-bar">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink onClick={() => setOpen(false)} to={link.to}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={() => setOpen(!open)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M28.3333 16.6667H5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M35 10H5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M35 23.3333H5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M28.3333 30H5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <NavLink onClick={() => setOpen(false)} className={'profile-link'} to={'/profile'}>
        {/* <img src={'https://picsum.photos/50/50'} alt="profile" /> */}
        <span className="word-user">B</span>
      </NavLink>
    </header>
  );
};

export default Header;
