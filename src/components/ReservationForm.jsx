import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { fetchRooms } from '../redux/features/rooms/roomsSlice';
import { createReservation } from '../redux/features/reservations/reservationsSlice';
import 'react-datepicker/dist/react-datepicker.css';

const ReservationForm = () => {
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.room.rooms);
  const storedUserData = localStorage.getItem('userData');
  const currentUser = JSON.parse(storedUserData);
  const navigate = useNavigate();
  console.log(currentUser.name);
  const { roomId } = useParams();
  console.log(roomId);
  const [formData, setFormData] = useState({
    username: currentUser.name,
    room: roomId || '',
    check_in: new Date(),
    check_out: new Date(),
  });

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });
  };

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const checkInISO = formData.check_in.toISOString();
    const checkOutISO = formData.check_out.toISOString();

    const requestData = {
      check_in: checkInISO,
      check_out: checkOutISO,
      room_id: formData.room,
    };
    try {
      await dispatch(createReservation(requestData));
      navigate('/app/Profile');
    } catch (error) {
      console.error('Error adding room:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            disabled
          />
        </div>
        <div>
          <label>Room:</label>
          <select
            name="room"
            value={formData.room}
            onChange={handleInputChange}
            disabled={!!roomId}
          >
            <option value="">Select a room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Check-In Date:</label>
          <DatePicker
            selected={formData.check_in}
            name="check_in"
            onChange={(date) => handleDateChange(date, 'check_in')}
          />
        </div>
        <div>
          <label>Check-Out Date:</label>
          <DatePicker
            selected={formData.check_out}
            name="check_out"
            onChange={(date) => handleDateChange(date, 'check_out')}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ReservationForm;
