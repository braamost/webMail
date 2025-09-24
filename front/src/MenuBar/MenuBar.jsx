import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import NewMail from "../NewMail/NewMail";
import { 
  FaEnvelope, 
  FaTrash, 
  FaPaperPlane, 
  FaStar, 
  FaArchive, 
  FaExclamationTriangle,
  FaAddressBook,
  FaFileAlt,
  FaSignOutAlt,
  FaPlus,
  FaBars,
  FaTimes
} from "react-icons/fa";
function MenuBar({ user, handleLogout, onLinkClick }) {
  const [isNewMail, setIsNewMail] = useState(false);
  const location = useLocation();
  
  const imgSrc = user?.profileUrl
  ? `http://localhost:8080${user.profileUrl}` 
  : "/man.jpg"; // fallback

  const newMail = (email = null) => {
    setIsNewMail(!isNewMail);
  };

  const menuItems = [
    { path: "/InboxFolder", label: "Inbox", icon: FaEnvelope },
    { path: "/SentMails", label: "Sent", icon: FaPaperPlane },
    { path: "/Starred", label: "Starred", icon: FaStar },
    { path: "/Archive", label: "Archive", icon: FaArchive },
    { path: "/Spam", label: "Spam", icon: FaExclamationTriangle },
    { path: "/Trash", label: "Trash", icon: FaTrash },
    { path: "/Draft", label: "Drafts", icon: FaFileAlt },
    { path: "/MyContacts", label: "Contacts", icon: FaAddressBook },
  ];

  const isActive = (path) => location.pathname === path;
  return (
    <>
      <div className="w-64 bg-white/90 shadow-xl h-full">
        <div className="p-6">
          {/* Profile Section */}
          <div className="mb-8">
            <Link 
              to="/UserFolder" 
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              onClick={onLinkClick}
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-full overflow-hidden border-4 border-blue-300 bg-blue-100 shadow">
                <img
                  src={imgSrc}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full bg-white"
                  onError={e => { e.target.onerror = null; e.target.src = '/man.jpg'; }}
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="font-semibold text-blue-900 text-lg leading-tight">{user.username}</h2>
                <p className="text-sm text-gray-500 break-all">{user.email}</p>
              </div>
            </Link>
          </div>
          {/* New Mail Button */}
          <button 
            onClick={() => newMail()}
            className="w-full bg-blue-600 text-white flex items-center justify-center space-x-2 mb-6 rounded-lg py-2 hover:bg-blue-800 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            <span>New Mail</span>
          </button>
          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-200 text-blue-800 border-r-2 border-blue-600'
                      : 'text-blue-900 hover:bg-blue-100'
                  }`}
                  onClick={onLinkClick}
                >
                  <Icon className={`w-5 h-5 ${isActive(item.path) ? 'text-blue-600' : 'text-blue-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          {/* Logout Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => { handleLogout(); onLinkClick && onLinkClick(); }}
              className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* New Mail Modal */}
      {isNewMail && <NewMail user={user} setIsNewMail={setIsNewMail} />}
    </>
  );
}
export default MenuBar;
