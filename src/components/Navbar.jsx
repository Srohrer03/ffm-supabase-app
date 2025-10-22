import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/cfs-logo.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Mock user role - in real app, get from AuthContext
  const userRole = 'ADMIN'; // Change to 'VENDOR' to test vendor portal

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const NavigationLinks = ({ mobile = false }) => {
    const linkClass = mobile 
      ? "text-white text-lg font-medium hover:text-cfs-light transition-colors duration-200 py-2"
      : "text-white/90 hover:text-cfs-light transition-all duration-200 font-medium";

    return (
      <>
        <Link to="/" className={linkClass} onClick={mobile ? closeMenu : undefined}>
          Home
        </Link>
        {userRole === 'VENDOR' ? (
          <Link to="/vendor" className={linkClass} onClick={mobile ? closeMenu : undefined}>
            Vendor Portal
          </Link>
        ) : (
          <>
            <Link to="/dashboard" className={linkClass} onClick={mobile ? closeMenu : undefined}>
              Dashboard
            </Link>
            <Link to="/workorders" className={linkClass} onClick={mobile ? closeMenu : undefined}>
              Work Orders
            </Link>
            <Link to="/pm" className={linkClass} onClick={mobile ? closeMenu : undefined}>
              PM Calendar
            </Link>
            <Link to="/pm-templates" className={linkClass} onClick={mobile ? closeMenu : undefined}>
              PM Templates
            </Link>
            <Link to="/reports" className={linkClass} onClick={mobile ? closeMenu : undefined}>
              Reports
            </Link>
            <Link to="/vendors" className={linkClass} onClick={mobile ? closeMenu : undefined}>
              Vendor Portal
            </Link>
            <Link to="/capital-projects" className={linkClass} onClick={mobile ? closeMenu : undefined}>
              Capital Projects
            </Link>
          </>
        )}
      </>
    );
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-cfs-navy via-cfs-dark to-cfs-blue shadow-xl px-6 py-5 flex items-center justify-between backdrop-blur-sm">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
          <img src={logo} alt="CFS Brands" className="h-10" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          <NavigationLinks />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={closeMenu}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-cfs-navy to-cfs-dark shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <div className="flex items-center space-x-3">
                  <img src={logo} alt="CFS Brands" className="h-10" />
                  <span className="font-bold text-lg text-white">Menu</span>
                </div>
                <button
                  onClick={closeMenu}
                  className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Menu Links */}
              <div className="flex-1 flex flex-col justify-center px-6 space-y-6">
                <NavigationLinks mobile={true} />
              </div>

              {/* Menu Footer */}
              <div className="p-6 border-t border-white/20">
                <p className="text-white/60 text-sm text-center">
                  CFS Facilities Management
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}