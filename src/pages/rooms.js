import React from 'react';
import { Link } from 'react-router-dom';
import { useRooms, useUser } from '../redux/selectors';

const Rooms = () => {
  const user = useUser();
  const rooms = useRooms();

  return (
    <div className="container-md">
      <div className="row-header">
        <h1 className='full'>joylar royxati</h1>
      </div>
      <div className="grid">
        {rooms?.map((room) => (
          <Link
            to={room?.afitsant_id !== null && room?.afitsant_id !== user?.id ? undefined : `/order/${room?.id}`}
            key={room?.id}
            className={`room ${room?.active ? 'busy' : ''} ${
              room?.afitsant_id !== null && room?.afitsant_id !== user?.id ? 'disabled' : ''
            }`}
          >
            <p>{room?.name}-stol</p>
            <p>{room?.places}-kishilik</p>
            {room?.active ? <p>band stol</p> : null}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
