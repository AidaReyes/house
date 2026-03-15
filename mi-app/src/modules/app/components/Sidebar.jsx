import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink to="/arrendador">
              Arrendador
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Sidebar;