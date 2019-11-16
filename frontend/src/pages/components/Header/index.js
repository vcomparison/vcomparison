import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const headerLinks = [
  {
    label: "3D/2D images",
    href: "/3D2D"
  },
  {
    label: "3D image/DVH",
    href: "/3DDVH"
  },
  {
    label: "Plans",
    href: "/plans"
  }
];

const Header = () => {
  return (
    <div className="header">
      <div className="row">
        <div className="col-xs-4">
          <Link to="/" className="header__logo">
            VComparison
          </Link>
        </div>
        <div className="col-xs-8">
          <div className="header__links">
            {headerLinks.map(({ label, href }) => (
              <Link className="header__link" key={label} to={href}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
