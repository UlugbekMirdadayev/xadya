import React, { useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import Accord from 'components/accord';
import { useLocaleOrders, useOrders, useProducts } from '../redux/selectors';
import { formatCurrencyUZS } from 'utils';
import { deleteRequest, getRequest, patchRequest, postRequest } from 'services/api';
import { toast } from 'react-toastify';
import { setRoomCompleted } from '../redux/localeOrders';
import { useDispatch } from 'react-redux';
import { setOrders } from '../redux/orders';
import { useOutsideClick } from 'utils/hooks';
import moment from 'moment';

const Order = () => {
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
    patchRequest(`order/report/${order_id}`, {})
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

  const setOrder = (product, index) => {
    if (index === 0) {
      setLoading(true);
    }

    postRequest('order', { room_id: id, product_id: product?.id, quantity: product?.count })
      .then(({ data }) => {
        if (thisRoomOrders?.length - 1 === index) {
          toast.success(data?.message);
          dispatch(setRoomCompleted({ room: id }));
          getRequest('order')
            .then((orders) => {
              dispatch(setOrders(orders?.data?.innerData));
              setLoading(false);
            })
            .catch((err) => {
              toast.error(err?.response?.data?.message || 'Error');
              setLoading(false);
            });
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || 'Error');
        if (thisRoomOrders?.length - 1 === index) {
          setLoading(false);
        }
      });
  };

  const handleAddCart = () => thisRoomOrders?.map(setOrder);

  const handleOpenDetails = (order_id) => {
    setLoading(true);
    getRequest(`/order/${order_id}`)
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
    deleteRequest(`order/${order_id}`)
      .then(({ data }) => {
        toast.info(data?.message);
        navigate('/rooms');
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };

  const handleRemoveCancel = (item_id) => {
    deleteRequest(`order/item/${item_id}`)
      .then(({ data }) => {
        toast.info(data?.message);
        setIsOrderMore({ ...isOrderMore, open: false });
      })
      .catch((err) => {
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
                <button onClick={() => handleCancel(isOrderMore?.id)}>Bekor qilish</button>
              </div>
              <ol className="alternating-colors">
                <strong>{"Buyurtma ma'lumotlari"}</strong>
                {isOrderMore?.products?.map((product) => (
                  <li key={product?.id}>
                    <button className="remove" onClick={() => handleRemoveCancel(product?.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24.6" height="24.6" viewBox="0 0 256 256">
                        <defs></defs>
                        <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                          <path
                            d="M 13.4 88.492 L 1.508 76.6 c -2.011 -2.011 -2.011 -5.271 0 -7.282 L 69.318 1.508 c 2.011 -2.011 5.271 -2.011 7.282 0 L 88.492 13.4 c 2.011 2.011 2.011 5.271 0 7.282 L 20.682 88.492 C 18.671 90.503 15.411 90.503 13.4 88.492 z"
                            transform=" matrix(1 0 0 1 0 0) "
                            strokeLinecap="round"
                          />
                          <path
                            d="M 69.318 88.492 L 1.508 20.682 c -2.011 -2.011 -2.011 -5.271 0 -7.282 L 13.4 1.508 c 2.011 -2.011 5.271 -2.011 7.282 0 l 67.809 67.809 c 2.011 2.011 2.011 5.271 0 7.282 L 76.6 88.492 C 74.589 90.503 71.329 90.503 69.318 88.492 z"
                            transform=" matrix(1 0 0 1 0 0) "
                            strokeLinecap="round"
                          />
                        </g>
                      </svg>
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
