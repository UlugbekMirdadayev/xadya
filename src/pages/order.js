import React, { useMemo } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import Accord from 'components/accord';
import { useLocaleOrders, useOrders, useProducts } from '../redux/selectors';
import { formatCurrencyUZS } from 'utils';

const Order = () => {
  const { id } = useParams();

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

  return (
    <div className="container-md">
      <div className="row-header">
        <NavLink to={'/rooms'}>
          <button>Ortga qaytish</button>
        </NavLink>
        <h1 className="full">Menu</h1>
      </div>

      {menus.map((room, key) => (
        <Accord defaultOpened={!key} key={key} room={room} id={id} thisRoomOrders={thisRoomOrders} />
      ))}
      {isOrder?.id ? (
        <button className="order-btn">
          Buyurtmani yopish {isOrder?.total_price && `${formatCurrencyUZS(isOrder?.total_price)?.replace('UZS', '')} UZS`}
        </button>
      ) : (
        ''
      )}
      {thisRoomOrders?.length ? (
        <button className="order-btn">
          Buyurtma berish {sumWithInitial && `${formatCurrencyUZS(sumWithInitial)?.replace('UZS', '')} UZS`}
        </button>
      ) : (
        ''
      )}
    </div>
  );
};

export default Order;
