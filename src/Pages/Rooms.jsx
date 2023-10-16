import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OwlCarousel from 'react-owl-carousel';
// import { useNavigate } from 'react-router';
import { fetchRooms } from '../redux/features/rooms/roomsSlice';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import RoomCard from '../components/RoomCard/Room_card';

const Rooms = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const rooms = useSelector((state) => state.room.rooms);
  const isLoading = useSelector((state) => state.room.isLoading);
  console.log(rooms);
  const error = useSelector((state) => state.room.error);
  const token = localStorage.getItem('authToken');
  const [isTokenAvailable, setIsTokenAvailable] = useState(false);

  useEffect(() => {
    if (token && !isTokenAvailable) {
      dispatch(fetchRooms())
        .then((result) => {
          const { payload } = result;
          if (fetchRooms.fulfilled.match(result) && payload.length > 0) {
            setIsTokenAvailable(true);
          } else {
            setIsTokenAvailable(false);
          }
        });
    }
  }, [dispatch, token, isTokenAvailable]);

  // if (token && !isTokenAvailable) {
  //   return (
  //     <div>Loading rooms... </div>
  //   );
  // }

  // if (!token && !isLoading) {
  //   return (
  //     <div>
  //       Please log in to view available rooms.
  //       <button type="button" onClick={() => { navigate('/login'); }}>Click here</button>
  //     </div>
  //   );
  // }

  if (error && !isLoading) {
    window.location.reload();
  }

  return (
    <div className="md:container w-full room_container pt-40">
      <div className="text-center flex flex-col items-center pt-7">
        <h1 className="text-4xl font-black lg:text-3xl uppercase text-zinc-950">
          Available Rooms
        </h1>
        <h6 className="mb-10 font-serif text-gray-500">
          Please select your rooms to view details
        </h6>
        <hr className="border-t border-gray-300 w-28 text-center line" />
      </div>

      <div className="md:container md:mx-auto text-center flex flex-col items-center w-full">
        <OwlCarousel
          className="owl-theme p-10"
          margin={10}
          dots={false}
          rewind={false}
          nav
          responsive={{
            0: {
              items: 1, // Show 1 item on screens less than 600px wide (typically mobile)
            },
            768: {
              items: 2, // Show 2 items on screens 768px wide and wider (tablets)
            },
            992: {
              items: 3, // Show 3 items on screens 992px wide and wider (small desktop)
            },
          }}
        >
          {
              rooms.length > 0 ? (
                rooms.map((room) => (
                  <div className="item" key={room.id}>
                    <RoomCard
                      name={room.name}
                      description={room.description}
                      image={room.image}
                      id={room.id}
                    />
                  </div>
                ))) : (<div>Fetching Rooms</div>
              )
}
        </OwlCarousel>
      </div>
    </div>
  );
};

export default Rooms;
