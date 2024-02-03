import React, { useState } from 'react';
import './form.css';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/user';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSubmit = (form) => {
    form.preventDefault();
    const { fullname = '', phone = '', password = '' } = Object.fromEntries(new FormData(form.target));
    if (!fullname || !phone || !password) {
      return setError(true);
    }
    setError(false);
    setLoading(true);
    axios
      .post('https://api.hadyacrm.uz/api/afitsant/signup', Object.fromEntries(new FormData(form.target)))
      .then(() => {
        axios
          .post('https://api.hadyacrm.uz/api/afitsant/login', { phone, password })
          .then(({ data }) => {
            setLoading(false);
            toast.success(data?.message || 'Success');
            localStorage.setItem('token-xadya', data?.innerData?.token);
            dispatch(setUser(data?.innerData));
            navigate('/rooms', { replace: true });
          })
          .catch(({ response: { data } }) => {
            setLoading(false);
            toast.error(data?.message || 'Error');
          });
      })
      .catch(({ response: { data } }) => {
        setLoading(false);
        toast.error(data?.message || 'Error');
      });
  };
  return (
    <>
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form onSubmit={onSubmit} className={error ? 'error' : ''}>
        <h3>{"Ro'yxatdan o'tish"}</h3>

        <label htmlFor="fullname">{"To'liq ism"}</label>
        <input type="text" placeholder="ism familiya" id="fullname" name="fullname" />

        <label htmlFor="phone">Telefon raqami</label>
        <input type="tel" placeholder="998xxxyyzz" id="phone" name="phone" />

        <label htmlFor="password">Parol</label>
        <input type="password" placeholder="Parol" id="password" name="password" />
        <label className="error"> {error ? "Ma'lumotlarni to'liq kiriting !" : null}</label>
        <button type="submit" disabled={loading}>
          {loading ? <div className="lds-dual-ring" /> : "Ro'yxatdan o'tish"}
        </button>
        <NavLink to={'/login'}>
          <button type="button">{'Kirish'}</button>
        </NavLink>
      </form>
    </>
  );
};

export default Register;
