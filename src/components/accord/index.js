/* eslint-disable react/prop-types */
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addLocaleOrder, removeLocaleOrder } from '../../redux/localeOrders';

const Accord = ({ room, id, defaultOpened = false, thisRoomOrders = [] }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(defaultOpened);

  const handleAddBasket = useCallback(
    (recep) => {
      dispatch(addLocaleOrder({ ...recep, room: id }));
    },
    [id, thisRoomOrders]
  );

  const handleRemoveBasket = useCallback(
    (recep) => {
      dispatch(removeLocaleOrder({ ...recep, room: id }));
    },
    [id]
  );

  const thisSelectedProd = (prods) => {
    return thisRoomOrders?.find((rec) => rec?.id === prods?.id);
  };

  return (
    <>
      <div className={`row-header accord ${open ? 'opened' : ''}`} onClick={() => setOpen(!open)}>
        <h1 className="full">
          {room?.menus[0] && <img className='opener-image' src={room?.menus[0]?.img} alt={room?.menus[0]?.name} />}
          {room.name}
          <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 330 330">
            <path
              id="XMLID_224_"
              d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394  l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393  C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"
            />
          </svg>
        </h1>
      </div>
      {open && (
        <div className="grid">
          {room.menus.map((recep, index) => (
            <div key={index} className={`room rec`}>
              <img className="product-image" src={recep.img} alt={recep.name} />
              <span className="title-prod">{recep.name}</span>
              <span className="price-prod">Narxi: {recep.price} uzs</span>
              {thisSelectedProd(recep)?.count ? (
                <button className="row-bottom">
                  <svg onClick={() => handleRemoveBasket(recep)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path d="M6 12L18 12" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {thisSelectedProd(recep)?.count}
                  <svg
                    onClick={() => {
                      handleAddBasket(recep);
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#fff"
                    viewBox="0 0 45.402 45.402"
                  >
                    <g>
                      <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141   c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27   c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435   c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z" />
                    </g>
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleAddBasket(recep);
                  }}
                >{`Qo'shish`}</button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Accord;
