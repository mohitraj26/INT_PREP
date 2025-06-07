import { useState } from "react"
import { Code2, Menu, X ,User, Code, LogOut} from "lucide-react"
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import LogoutButton from '../LogoutButton';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authUser } = useAuthStore();


  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false) // Close mobile menu after clicking
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">INT_PREP</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {/* Navigation Links */}
            <div className="flex space-x-4 mr-6">
              <button
                onClick={() => scrollToSection("features")}
                className="text-slate-300 hover:text-white transition-colors px-3 py-2"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-slate-300 hover:text-white transition-colors px-3 py-2"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-slate-300 hover:text-white transition-colors px-3 py-2"
              >
                Contact
              </button>
            </div>

            {/* Auth Buttons */}
              {authUser ? (
                // User Profile and Dropdown
                <div className="flex items-center gap-8">
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar flex flex-row ">
                      <div className="w-10 rounded-full ">
                        <img
                          src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
                          alt="User Avatar"
                          className="object-cover"
                        />
                      </div>
                    </label>
                    <ul
                      tabIndex={0}
                      className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-3"
                    >
                      <li>
                        <p className="text-base font-semibold">{authUser?.name}</p>
                        <hr className="border-gray-200/10" />
                      </li>
                      <li>
                        <Link
                          to="/profile"
                          className="hover:bg-primary hover:text-white text-base font-semibold"
                        >
                          <User className="w-4 h-4 mr-2" />
                          My Profile
                        </Link>
                      </li>
                      {authUser?.role === "ADMIN" && (
                        <li>
                          <Link
                            to="/add-problem"
                            className="hover:bg-primary hover:text-white text-base font-semibold"
                          >
                            <Code className="w-4 h-4 mr-1" />
                            Add Problem
                          </Link>
                        </li>
                      )}
                      <li>
                        <LogoutButton className="hover:bg-primary hover:text-white">
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </LogoutButton>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-white bg-transparent border border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-300 px-4 py-2 rounded-md"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-white bg-transparent border border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-300 px-4 py-2 rounded-md"
                  >
                    Signup
                  </Link>
                </div>
              )}


            
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700/50">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => scrollToSection("features")}
                className="text-slate-300 hover:text-white transition-colors px-4 py-2 text-left"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-slate-300 hover:text-white transition-colors px-4 py-2 text-left"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-slate-300 hover:text-white transition-colors px-4 py-2 text-left"
              >
                Contact
              </button>
              <div className="pt-2 border-t border-slate-700/50">
                <button className="text-white bg-transparent border border-slate-600/50 hover:bg-slate-700/50 px-4 py-2 rounded-md text-left w-full mb-2"
                  >
                  Login
                </button>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-md text-left w-full">
                  Signup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
