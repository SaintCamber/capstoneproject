import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
	const sessionUser = useSelector(state => state.session.user);

	return (
		<ul className="Navigation">
			{isLoaded && (
				<li>
					<ProfileButton user={sessionUser} />
				</li>
			)}
			{sessionUser && sessionUser.email === 'demo@aa.io' && (

				<li>
					<NavLink className="ToAdmin" to="/AdminPanel">Admin Panel</NavLink>
				</li>

			)}
		</ul>
	);
}

export default Navigation;
