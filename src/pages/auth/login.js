import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/user';
import { useUser } from '../../redux/selectors';
import { toast } from 'react-toastify';
import { postRequest } from '../../services/api';

const Register = () => {
  const user = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSubmit = (form) => {
    form.preventDefault();
    const { phone = '', password = '' } = Object.fromEntries(new FormData(form.target));
    if (!phone || !password) {
      return setError(true);
    }
    setError(false);
    setLoading(true);
    postRequest('afitsant/login', { phone, password })
      .then(({ data }) => {
        setLoading(false);
        toast.success(data?.message || 'Success');
        dispatch(setUser(data?.innerData));
        localStorage.setItem('token-xadya', data?.innerData?.token);
        localStorage.setItem('user-xadya', JSON.stringify({ phone, password }));
        navigate('/rooms', { replace: true });
      })
      .catch(({ response } = { response: {} }) => {
        setLoading(false);
        toast.error(response?.data?.message || 'Error');
      });
  };

  useEffect(() => {
    if (user?.id) {
      navigate('/rooms', { replace: true });
    }
  }, [user?.id, navigate]);

  return (
    <>
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form onSubmit={onSubmit} className={error ? 'error' : ''}>
        <h3>{'Kirish'}</h3>

        <label htmlFor="phone">Telefon raqami</label>
        <input type="tel" placeholder="998xxxyyzz" id="phone" name="phone" />

        <label htmlFor="password">Parol</label>
        <input type="password" placeholder="Parol" id="password" name="password" />
        <label className="error"> {error ? "Ma'lumotlarni to'liq kiriting !" : null}</label>
        <button type="submit" disabled={loading}>
          {loading ? <div className="lds-dual-ring" /> : 'Kirish'}
        </button>
        <NavLink to={'/register'}>
          <button type="button">{"Ro'yxatdan o'tish"}</button>
        </NavLink>
      </form>
    </>
  );
};

export default Register;
