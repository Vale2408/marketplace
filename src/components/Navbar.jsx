import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUserAlt, FaSignOutAlt, FaBars, FaTimes, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { title } from '../App';

const links = [
  { name: "Home", path: "/", icon: <FaHome /> },
  { name: "Profilo", path: "/profile", icon: <FaUserAlt /> },
  { name: "Logout", path: "/logout", icon: <FaSignOutAlt /> },
  { name: "Login", path: "/login", icon: <FaSignInAlt /> },
  { name: "Register", path: "/register", icon: <FaUserPlus /> }
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const user = localStorage.getItem("user");
  const isLoggedIn = !!user;

  // Filtra i link in base allo stato login
  const filteredLinks = links.filter(link => {
    const hiddenForLoggedIn = ["Login", "Register"];
    const hiddenForGuests = ["Profilo", "Logout"];

    if (isLoggedIn && hiddenForLoggedIn.includes(link.name)) return false;
    if (!isLoggedIn && hiddenForGuests.includes(link.name)) return false;

    return true;
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 left-0 w-full z-50">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-blue-500 text-2xl font-bold cursor-pointer">{title}</div>
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 text-3xl focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <ul className="hidden lg:flex lg:space-x-8">
          {filteredLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`text-gray-700 text-lg font-medium flex items-center space-x-2 py-2 px-4 rounded-lg transition duration-300 hover:bg-blue-100 hover:text-blue-600
                  ${location.pathname === link.path ? 'bg-blue-100 text-blue-600' : ''}`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile menu with animation */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 border-t' : 'max-h-0'} bg-white`}
      >
        <ul className="flex flex-col px-4 py-4 space-y-3">
          {filteredLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                onClick={closeMenu}
                className={`block text-gray-800 text-lg font-medium px-3 py-2 rounded-lg hover:bg-blue-100 transition
                  ${location.pathname === link.path ? 'bg-blue-100 text-blue-600' : ''}`}
              >
                <div className="flex items-center space-x-2">
                  {link.icon}
                  <span>{link.name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
