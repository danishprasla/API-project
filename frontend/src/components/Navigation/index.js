import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  //checking to see if the sessionUser exists aka, is someone logged in
  const sessionUser = useSelector(state => state.session.user);
  
  let sessionLinks;
//if the user is logged in set the sessionLinks to below and pass the user prop to profile button
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    //if no user is logged in, display login/signup buttons
    sessionLinks = (
      <li>
        <NavLink to="/login">Log In</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
      </li>
    );
  }

  return (
    <ul>
      <li>
        <NavLink exact to="/">Home</NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;