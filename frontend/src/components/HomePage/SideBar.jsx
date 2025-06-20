import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Code2, 
  PlayCircle, 
  Trophy, 
  ChevronRight,
  CircleChevronLeft,
  CircleChevronRight,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeContext } from '../../context/Theme';
import TaskIcon from '@mui/icons-material/Task';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutButton from '../LogoutButton';

const Sidebar = ({ activeItem, setActiveItem }) => {
  const { authUser } = useAuthStore();
  
  const isAdmin = authUser?.role === 'ADMIN';

  const [isCollapsed, setIsCollapsed] = useState(false);
  // const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'problems', label: 'Problems', icon: Code2 },
    { id: 'playlists', label: 'Playlists', icon: PlayCircle },
    { id: 'contest', label: 'Contest', icon: Trophy },
    { id: 'solved Problems', label: 'Solved Problems', icon: TaskIcon },
    { id: 'profile', label: 'Profile', icon: PersonOutlineIcon },
    ...(isAdmin ? [{ id: 'add-problems', label: 'Add Problems', icon: AddCircleIcon }] : [])

  ];

  const handleLogout = () => {
    console.log('Logging out...');
    setIsProfileDropdownOpen(false);
  };

  const { mode, toggleTheme } = useThemeContext();
  const isDarkMode = mode === 'dark';
  const handleThemeToggle = () => {
    toggleTheme();
    setIsProfileDropdownOpen(false);
  };

  const themeClasses = {
    dark: {
      sidebar: 'bg-gray-900 text-white border-gray-700',
      header: 'border-gray-700',
      button: 'hover:bg-gray-800',
      inactive: 'text-gray-300 hover:bg-gray-800 hover:text-white',
      active: 'bg-blue-600 text-white',
      profile: 'border-gray-700',
      themeButton: 'text-gray-400 hover:text-yellow-400',
      dropdown: 'bg-gray-800 border-gray-700 text-white',
      dropdownItem: 'hover:bg-gray-700'
    },
    light: {
      sidebar: 'bg-white text-gray-900 border-gray-200 shadow-2xl',
      header: 'border-gray-200',
      button: 'hover:bg-gray-100',
      inactive: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
      active: 'bg-blue-500 text-white',
      profile: 'border-gray-200',
      themeButton: 'text-gray-600 hover:text-blue-500',
      dropdown: 'bg-white border-gray-200 text-gray-900 shadow-lg',
      dropdownItem: 'hover:bg-gray-50'
    }
  };

  const currentTheme = isDarkMode ? themeClasses.dark : themeClasses.light;

  return (
    <>
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <div className={`
        flex flex-col h-screen ${currentTheme.sidebar} shadow-xl transition-all duration-300 z-50
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobile ? 'fixed top-0 left-0 transform transition-transform duration-300' : 'relative'}
        ${isMobile && isCollapsed ? '-translate-x-full' : 'translate-x-0'}
        border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
      `}>
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            absolute top-16 -right-3 transform -translate-y-1/2 z-60
            w-6 h-6 rounded-full ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'} 
            border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} 
            flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110
            ${isMobile ? 'hidden' : 'flex'}
          `}
        >
          {isCollapsed ? <CircleChevronLeft className="w-5 h-5" /> : <CircleChevronRight className="w-5 h-5" />}
        </button>

        {/* Header */}
        <div className={`p-6 border-b ${currentTheme.header} min-h-[80px] flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center min-w-[2.5rem]">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                INT_PREP
              </h1>
            )}
          </div>

          {isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-2 rounded-lg transition-colors duration-200 ${currentTheme.button}`}
            >
              {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  if (isMobile) setIsCollapsed(true);
                }}
                className={`
                  w-full flex items-center rounded-lg text-left transition-all duration-200 group relative
                  ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}
                  ${isActive ? currentTheme.active + ' shadow-lg transform scale-105' : currentTheme.inactive + ' hover:transform hover:scale-105'}
                `}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className={`
                  w-5 h-5 
                  ${isCollapsed ? '' : 'mr-3'} 
                  ${isActive ? 'text-white' : (isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500')}
                `} />
                {!isCollapsed && (
                  <>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 ml-auto text-white" />
                    )}
                  </>
                )}
                {isCollapsed && isActive && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-l-full"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className={`p-4 border-t ${currentTheme.profile} relative`} ref={profileRef}>
          <div
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className={`
              flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer group relative
              ${currentTheme.button}
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden min-w-[2.5rem]">
              <img
                src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
                alt="User Avatar"
                className="object-cover w-full h-full"
              />
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 ml-3 min-w-0">
                  <p className="text-sm font-medium truncate">{authUser?.name}</p>
                  <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {authUser?.email}
                  </p>
                </div>
                <div className="ml-2">
                  {isProfileDropdownOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </>
            )}
          </div>

          {/* Dropdown */}
          {isProfileDropdownOpen && (
            <div className={`
              absolute bottom-full left-4 right-4 mb-2 rounded-lg border ${currentTheme.dropdown}
              shadow-lg z-70 py-2 animate-in slide-in-from-bottom-2 duration-200 w-fit
            `}>
              <button
                onClick={handleThemeToggle}
                className={`w-full flex items-center px-4 py-2 text-sm ${currentTheme.dropdownItem}`}
              >
                {isDarkMode ? <Sun className="w-4 h-4 mr-3 text-yellow-400" /> : <Moon className="w-4 h-4 mr-3 text-blue-500" />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <div className={`h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} mx-2 my-1`} />
              
              <LogoutButton className="w-4 h-4 mr-3"/>
              {/* <button
                onClick={handleLogout}
                className={`w-full flex items-center px-4 py-2 text-sm ${currentTheme.dropdownItem} text-red-500 hover:text-red-600`}
              >
                <LogOut className="w-4 h-4 mr-3" />
                
                <span>Logout</span>
              </button> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
