import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { getRequest, post } from 'services/api';
import { useLocaleOrders, useUser } from '../../redux/selectors';
import { setProducts } from '../../redux/products';
import { setOrders } from '../../redux/orders';
import { setUser } from '../../redux/user';
import * as i from 'assets/icon';
import './style.css';
import { setRooms } from '../../redux/rooms';
import { useOutsideClick } from 'utils/hooks';

const links = [
  { label: 'Joylar royxati', to: '/rooms' },
  { label: 'Buyurmalar royxati', to: '/orders' },
  { label: 'Chiqish', to: '/', logout: true }
];

const Header = () => {
  const headerModal = useRef();
  const user = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const localeOrders = useLocaleOrders();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const [activeUser, setActiveUser] = useState(true);

  useEffect(() => {
    if (user?.active !== 1) {
      setLoading(true);
      if (!localStorage['token-xadya'] || !localStorage['user-xadya']) {
        setLoading(false);
        navigate('/register', { replace: true });
      } else if (localStorage['user-xadya']) {
        const obj = JSON.parse(localStorage['user-xadya'] || '{}');
        if (obj.phone && obj.password) {
          post('afitsant/login', obj)
            .then(({ data }) => {
              localStorage.setItem('token-xadya', data?.innerData?.token);
              dispatch(setUser(data?.innerData));
            })
            .catch(({ response: { data } } = { data: { message: 'Error' } }) => {
              toast.error(data?.message);
              setLoading(false);
              localStorage.clear();
              navigate('/register', { replace: true });
            });
        }
      }
    }
  }, [user?.active]);

  const getRoom = () => {
    getRequest('room', user?.token)
      .then(({ data }) => {
        dispatch(setRooms(data?.innerData));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (user?.active === 0) {
      setActiveUser(false);
    } else if (user?.active === 1) {
      setActiveUser(true);
    }
  }, [user?.active]);

  useEffect(() => {
    if (user?.token) {
      getRequest('product', user?.token)
        .then((products) => {
          dispatch(setProducts(products?.data?.innerData));
          getRequest('order', user?.token)
            .then((orders) => {
              setLoading(false);
              getRoom();
              dispatch(setOrders(orders?.data?.innerData));
            })
            .catch((err = { data: { message: 'Error' } }) => {
              console.log(err);
              setLoading(false);
            });
        })
        .catch((err) => {
          console.log(err?.response?.data?.message);
          setLoading(false);
        });
    }
  }, [user?.token]);

  const handleExit = () => {
    setOpen(false);
    dispatch(setUser(null));
    dispatch(setOrders([]));
    dispatch(setProducts([]));
    dispatch(setRooms([]));
    localStorage.clear();
    navigate('/register', { replace: true });
  };

  useOutsideClick(headerModal, () => setOpen(false));

  return (
    <header>
      {!activeUser && (
        <div className="page-401">
          <img src="https://images.plurk.com/5pHVCIyRNMdudWmVrrtQ.png" alt="401" />
          <h1>401 Unauthorized</h1>
          <span>Hisob aktiv emas !</span>
          <button className="logout-button" onClick={handleExit}>
            <i.LogOut2 />
            <span>Chiqish</span>
          </button>
        </div>
      )}
      {open && (
        <div className="modal" ref={headerModal}>
          <ul className="list-bar">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  className={link.logout ? 'logout' : undefined}
                  onClick={() => {
                    setOpen(link.logout || false);
                    if (link.logout) {
                      setConfirmLogout(true);
                    }
                  }}
                  to={link.to}
                >
                  {link.logout ? <i.LogOut /> : null}
                  {link.label}
                </NavLink>
              </li>
            ))}
            {confirmLogout && (
              <div className="absolute">
                <button className="reject" onClick={handleExit}>
                  Ha
                </button>
                <button className="resolve" onClick={() => setConfirmLogout(false)}>
                  {"Yo'q"}
                </button>
              </div>
            )}
          </ul>
        </div>
      )}
      <button
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(!open);
        }}
      >
        <i.Menu />
      </button>
      <NavLink onClick={() => setOpen(false)} className={'profile-link'} to={'/rooms'}>
        {/* <img src={'https://picsum.photos/50/50'} alt="profile" /> */}
        <span className="word-user">{loading ? <div className="lds-dual-ring" /> : user?.fullname?.slice(0, 1) || 'H'}</span>
        {localeOrders?.length ? <span className="count-orders">{localeOrders?.length || ''}</span> : ''}
      </NavLink>
    </header>
  );
};

export default Header;
