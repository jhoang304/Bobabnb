// frontend/src/components/Navigation/index.js
// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import ProfileButton from './ProfileButton';
// import './Navigation.css';

// function Navigation({ isLoaded }){
//   const sessionUser = useSelector(state => state.session.user);

//   return (
//     <ul>
//       <li>
//         <NavLink exact to="/">Home</NavLink>
//       </li>
//       {isLoaded && (
//         <li>
//           <ProfileButton user={sessionUser} />
//         </li>
//       )}
//     </ul>
//   );
// }

// export default Navigation;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logo from './logo.svg';
// import NewSpot from '../NewSpot';


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="NavBar">

      <NavLink exact to="/" className="Home-Icon">
      <img id="logo" src={logo} alt="bobabnb"/>
      </NavLink>

      {isLoaded && (
        <div className="userOptions">
        {sessionUser && <NavLink to="/spots/new" id="NewSpot">Create a New Spot</NavLink>}
        <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
}

export default Navigation;
