import React, { useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import Accord from 'components/accord';
import { useLocaleOrders, useOrders, useProducts, useUser } from '../redux/selectors';
import { formatCurrencyUZS } from 'utils';
import { deleteRequest, getRequest, patchRequest, postRequest } from 'services/api';
import { toast } from 'react-toastify';
import { setRoomCompleted } from '../redux/localeOrders';
import { useDispatch } from 'react-redux';
import { setOrders } from '../redux/orders';
import { useOutsideClick } from 'utils/hooks';
import moment from 'moment';
import { Minus } from 'assets/icon';

const Order = () => {
  const user = useUser();
  const [loading, setLoading] = useState();
  const [isOrderMore, setIsOrderMore] = useState({ open: false });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const modal = useRef();

  const localeOrders = useLocaleOrders();
  const products = useProducts();
  const orders = useOrders();

  const thisRoomOrders = useMemo(() => localeOrders?.find((rooms) => rooms.room === id)?.recs, [localeOrders, id]);
  const sumWithInitial = thisRoomOrders?.reduce((accumulator, currentValue) => {
    return Number(accumulator) + Number(currentValue.price * currentValue.count);
  }, []);

  const menus = useMemo(() => {
    const types = [...new Set(products?.map(({ type }) => type))];
    return types?.map((item) => {
      return {
        name: item,
        menus: products?.filter(({ type }) => type === item)
      };
    });
  }, [products]);

  const isOrder = useMemo(() => orders?.find((order) => order?.room_id === id), [orders]);

  const handleOrderComplete = (order_id) => {
    if (!order_id) return;
    setLoading(true);
    patchRequest(`order/report/${order_id}`, {}, user?.token)
      .then(({ data }) => {
        dispatch(setRoomCompleted({ room: id }));
        toast.success(data?.message || 'Success');
        setLoading(false);
        navigate('/rooms');
      })
      .catch((err) => {
        setLoading(false);
        toast.success(err?.response?.data?.message || 'Error');
      });
  };

  const handleAddCart = () => {
    setLoading(true);
    postRequest(
      'order',
      {
        room_id: id,
        orders: thisRoomOrders?.map((product) => ({ product_id: product?.id, quantity: product?.count }))
      },
      user?.token
    )
      .then(({ data }) => {
        toast.success(data?.message);
        getRequest('order', user?.token)
          .then((orders) => {
            dispatch(setOrders(orders?.data?.innerData));
            setLoading(false);
            dispatch(setRoomCompleted({ room: id }));
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || 'Error');
            setLoading(false);
          });
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || 'Error');
        setLoading(false);
      });
  };

  const handleOpenDetails = (order_id) => {
    setLoading(true);
    getRequest(`/order/${order_id}`, user?.token)
      .then(({ data }) => {
        setLoading(false);
        setIsOrderMore({ ...data?.innerData, open: true });
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  const handleCancel = (order_id) => {
    setLoading(true);
    deleteRequest(`order/${order_id}`, user?.token)
      .then(({ data }) => {
        setLoading(false);
        toast.info(data?.message);
        dispatch(setRoomCompleted({ room: id }));
        getRequest('order', user?.token)
          .then((orders) => {
            dispatch(setOrders(orders?.data?.innerData));
            setLoading(false);
            dispatch(setRoomCompleted({ room: id }));
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || 'Error');
            setLoading(false);
          });
        navigate('/rooms');
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  const handleRemoveCancel = (item_id) => {
    setLoading(true);
    deleteRequest(`order/item/${item_id}`, user?.token)
      .then(({ data }) => {
        setLoading(false);
        toast.info(data?.message);
        getRequest('order', user?.token)
          .then((orders) => {
            dispatch(setOrders(orders?.data?.innerData));
            setLoading(false);
            dispatch(setRoomCompleted({ room: id }));
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || 'Error');
            setLoading(false);
          });
        handleOpenDetails(isOrderMore?.id);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  useOutsideClick(modal, () => setIsOrderMore({ ...isOrderMore, open: false }));

  return (
    <div className="container-md">
      {isOrderMore.open && (
        <div className="modal modal-prods">
          <div className="modal-body" ref={modal}>
            <div className="top">
              <div className="row-header">
                <button onClick={() => setIsOrderMore({ open: false })}>Ortga</button>
                <button onClick={() => handleCancel(isOrderMore?.id)}>
                  {loading ? <div className="lds-dual-ring" /> : 'Bekor qilish'}
                </button>
              </div>
              <ol className="alternating-colors">
                <strong>{"Buyurtma ma'lumotlari"}</strong>
                {isOrderMore?.products?.map((product) => (
                  <li key={product?.id}>
                    <button disabled={loading} className="remove" onClick={() => handleRemoveCancel(product?.id)}>
                      {loading ? <div className="lds-dual-ring" /> : <Minus />}
                    </button>
                    <strong>
                      {product?.product_name} dan {product?.product_quantity} {product?.product_unit},{' '}
                      {`${formatCurrencyUZS(product?.product_price)?.replace('UZS', '')} UZS`}
                    </strong>
                    <p>Narxi {`${formatCurrencyUZS(product?.product_price * product?.product_quantity)?.replace('UZS', '')} UZS`}</p>
                    <p>Buyurtma vaqti: {moment(product?.created_at).format('DD-MM HH:MM:SS')}</p>
                  </li>
                ))}
              </ol>
            </div>
            <button className="order-btn full-btn" onClick={() => handleOrderComplete(isOrder?.id)}>
              Buyurtmani yopish {sumWithInitial && `${formatCurrencyUZS(sumWithInitial)?.replace('UZS', '')} UZS`}
            </button>
          </div>
        </div>
      )}
      <div className="row-header">
        <NavLink to={'/rooms'}>
          <button>Ortga qaytish</button>
        </NavLink>
        <h1 className="full">Menu</h1>
      </div>

      {menus.map((room, key) => (
        <Accord defaultOpened={!key} key={key} room={room} id={id} thisRoomOrders={thisRoomOrders} />
      ))}
      <div className="bottom-btns">
        {isOrder?.id ? (
          <button className="order-btn" disabled={loading} onClick={() => handleOpenDetails(isOrder?.id)}>
            {loading ? (
              <div className="lds-dual-ring" />
            ) : (
              <span>Buyurtmani yopish {isOrder?.total_price && `${formatCurrencyUZS(isOrder?.total_price)?.replace('UZS', '')} UZS`}</span>
            )}
          </button>
        ) : (
          ''
        )}
        {thisRoomOrders?.length ? (
          <button disabled={loading} className="order-btn" onClick={handleAddCart}>
            {loading ? (
              <div className="lds-dual-ring" />
            ) : (
              <span>Buyurtma berish {sumWithInitial && `${formatCurrencyUZS(sumWithInitial)?.replace('UZS', '')} UZS`}</span>
            )}
          </button>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default Order;
