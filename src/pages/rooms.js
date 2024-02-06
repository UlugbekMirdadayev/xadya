import React from 'react';
import { Link } from 'react-router-dom';
import { useRooms } from '../redux/selectors';

const Rooms = () => {
  const rooms = useRooms();

  return (
    <div className="container-md">
      <div className="row-header">
        <h1>joylar royxati</h1>
        <button>olib ketishga</button>
      </div>
      <div className="grid">
        {rooms.map((room) => (
          <Link to={`/order/${room?.id}`} key={room?.id} className={`room ${room?.active ? 'busy' : ''}`}>
            <p>{room?.name}-stol</p>
            <p>{room?.places}-kishili</p>
            {room?.active ? <p>band stol</p> : null}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
