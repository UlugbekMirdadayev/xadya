import React from 'react';
import '../assets/styles/room.css';
import { Link } from 'react-router-dom';

const rooms = Array.from({ length: 13 }, (_, k) => ({
  id: k + 'a1',
  number: k + 1,
  capacity: 6,
  busy: true
}));

const Rooms = () => {

  return (
    <div className="container-md">
      <div className="row-header">
        <h1>joylar royxati</h1>
        <button>olib ketishga</button>
      </div>
      <div className="grid">
        {rooms.map((room) => (
          <Link to={`/order/${room.number}`} key={room.id} className={`room ${room.busy ? 'busy' : ''}`}>
            <p>{room.number}-stol</p>
            <p>{room.capacity}-kishili</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
