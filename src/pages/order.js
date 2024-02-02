import React from 'react';
import { useParams } from 'react-router-dom';
import '../assets/styles/order.css';
import Accord from 'components/accord';

const menus = [
  {
    name: 'Pizza',
    menus: [
      {
        name: 'Qazili 35sm',
        price: 100000
      },
      {
        name: 'Qazili 39sm',
        price: 110000
      },
      {
        name: 'Hadya 35sm',
        price: 69000
      },
      {
        name: 'Hadya 39sm',
        price: 79000
      }
    ]
  },
  {
    name: 'KFC',
    menus: [
      {
        name: 'Shirin 1 ports + non',
        price: 28000
      },
      {
        name: 'Achchiq 1 ports + non',
        price: 30000
      },
      {
        name: 'Shirin 1 kg',
        price: 100000
      },
      {
        name: 'Achchiq 1 kg',
        price: 120000
      },
      {
        name: 'Fri',
        price: 12000
      }
    ]
  },
  {
    name: 'Tabaka',
    menus: [
      {
        name: 'Oyoqchalar 100gr',
        price: 9000
      },
      {
        name: 'Oyoqchalar 1kg',
        price: '90000'
      }
    ]
  },
  {
    name: 'Norin',
    menus: [
      {
        name: '1 ports',
        price: 10000
      },
      {
        name: '1 kg',
        price: 70000
      }
    ]
  },
  {
    name: 'Somsa',
    menus: [
      {
        name: "Go'shtli somsa",
        price: 5000
      },
      {
        name: 'Tabakali somsa',
        price: 5000
      },
      {
        name: 'Oshqovoqli somsa',
        price: 4000
      }
    ]
  },
  {
    name: 'Ichimliklar',
    menus: [
      {
        name: 'Sok',
        price: 13000
      },
      {
        name: 'Bardal choy',
        price: 20000
      },
      {
        name: 'Kofe qora',
        price: 5000
      },
      {
        name: 'Kofe malochniy',
        price: 5000
      },
      {
        name: 'Limon choy',
        price: 10000
      },
      {
        name: "Ko'k choy",
        price: 3000
      },
      {
        name: 'Qora choy',
        price: 3000
      }
    ]
  }
];

const Order = () => {
  const { id } = useParams();

  return (
    <div className="container-md">
      <div className="row-header">
        <h1 className="full">Menu</h1>
      </div>

      {menus.map((room, key) => (
        <Accord defaultOpened={!key} key={key} room={room} id={id} />
      ))}
    </div>
  );
};

export default Order;
