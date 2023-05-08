import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import airbnbLogo from '../../assets/airbnb.png'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className="nav">
      <li className="home">
        <NavLink exact to="/">
          <img className = "logo" src={airbnbLogo} alt="logo"/>
          AirLnL
        </NavLink>
      </li>
      {isLoaded && (
        <li>
          {sessionUser && (
            <NavLink className="create-new-spot" to ='/spots/new'>
              Create a New Spot
            </NavLink>
          )}
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;