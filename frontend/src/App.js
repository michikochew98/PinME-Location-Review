import "./app.css";
import { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { Room, Star } from '@material-ui/icons';
import axios from 'axios';
import { format } from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const myStorage = window.localStorage;
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(myStorage.getItem('user'));
  const [pins, setPins] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const newTitle = useRef(null);
  const newDesc = useRef(null);
  const newRating = useRef(0);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get('/pins');
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewState({
      ...viewState, latitude: lat, longitude: long,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newTitle.current.value && newDesc.current.value) {

      const newPin = {
        username: currentUser,
        title: newTitle.current.value,
        desc: newDesc.current.value,
        rating: newRating.current.value,
        lat: newPlace.lat,
        long: newPlace.long,
      }

      try {
        const res = await axios.post('/pins', newPin);
        setPins([...pins, res.data]);
        setNewPlace(null);
      } catch (err) {
        console.log(err)
      }
    }
  }

  const handleLogout = () => {
    myStorage.removeItem('user');
    setCurrentUser(null);
  }

  const handleDoubleClick = (e) => {
    if (currentUser) {
      setNewPlace({
        lat: e.lngLat.lat,
        long: e.lngLat.lng,
      });
    } else {
      setShowLogin(true);
    }
  }

  return <Map
    {...viewState}
    onMove={evt => setViewState(evt.viewState)}
    mapStyle="mapbox://styles/michiko0704/cl8pxuxah002517pvn8fcswoe"
    style={{ width: '100vw', height: '100vh' }}
    mapboxAccessToken={process.env.REACT_APP_MAPBOX}
    onDblClick={handleDoubleClick}
  >{
      pins.map(p => (<div key={p._id}>
        <Marker
          latitude={p.lat}
          longitude={p.long}>
          <Room style={{
            fontSize: viewState.zoom * 7,
            color: p.username === currentUser ? 'tomato' : 'teal',
            cursor: 'pointer'
          }}
            onClick={() => handleMarkerClick(p._id, p.lat, p.long)} />
        </Marker>
        {p._id === currentPlaceId && (
          <Popup
            latitude={p.lat}
            longitude={p.long}
            closeButton={true}
            closeOnClick={false}
            anchor="top"
            onClose={() => setCurrentPlaceId(null)}
          >
            <div className='card'>
              <label>Place</label>
              <h4 className='place'>{p.title}</h4>
              <label>Review</label>
              <p className='desc'>{p.desc}</p>
              <label>Rating</label>
              <div className='rating'>
                {Array(p.rating).fill(<Star />)}
              </div>
              <label>Information</label>
              <span className='username'>Created by <b>{p.username}</b></span>
              <span className='date'>{format(p.createdAt)}</span>
            </div>
          </Popup>)}</div>
      ))
    }
    {
      newPlace && <Popup
        latitude={newPlace.lat}
        longitude={newPlace.long}
        closeButton={true}
        closeOnClick={false}
        anchor="top"
        onClose={() => setNewPlace(null)}
      > <div>
          <form onSubmit={handleSubmit}>
            <label>Title</label>
            <input placeholder='Enter a title' ref={newTitle} />
            <label>Review</label>
            <textarea placeholder='Say us something about this place' ref={newDesc} />
            <label>Rating</label>
            <select ref={newRating}>
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
            </select>
            <button className='submitButton' type='submit'>Add Pin</button>
          </form>
        </div>
      </Popup>
    }
    {currentUser ?
      (<button className='button logout' type='submit' onClick={handleLogout}>Log out</button>)
      : (<div className='buttons'>
        <button className='button login' type='submit' onClick={() => setShowLogin(true)}>Login</button>
        <button className='button register' type='submit' onClick={() => setShowRegister(true)}>Register</button>
      </div>)}
    {showRegister && <Register setShowRegister={setShowRegister} />}
    {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}
  </Map>;
}

export default App;
