import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" className="text-2xl font-bold text-gray-800">
                        MarketMind ✨
                    </Link>
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <span className="text-gray-600">Credits: {user?.credits}</span>
                                <Link to="/dashboard" className="text-gray-600 hover:text-blue-500">Dashboard</Link>
                                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-blue-500">Login</Link>
                                <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { motion } from 'framer-motion';

// const Navbar = () => {
//     const { isAuthenticated, user, logout } = useAuth();
//     const navigate = useNavigate();

//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };

//     return (
//         <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
//             <div className="container mx-auto px-4">
//                 <div className="flex justify-between items-center py-4">
//                     <Link to="/" className="text-2xl font-bold text-slate-800 flex items-center gap-2">
//                         <motion.div animate={{ rotate: [0, 15, -10, 5, 0] }} transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.5 }}>
//                             <span role="img" aria-label="sparkles">✨</span>
//                         </motion.div>
//                         MarketMind
//                     </Link>
//                     <div className="hidden md:flex items-center space-x-6">
//                         <Link to="/" className="text-slate-600 hover:text-blue-600 transition-colors">Home</Link>
//                         <Link to="/#features" className="text-slate-600 hover:text-blue-600 transition-colors">Features</Link>
//                         <Link to="/#pricing" className="text-slate-600 hover:text-blue-600 transition-colors">Pricing</Link>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                         {isAuthenticated ? (
//                             <>
//                                 <span className="text-sm text-slate-500 hidden sm:block">Credits: <span className="font-bold text-blue-600">{user?.credits}</span></span>
//                                 <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Dashboard</Link>
//                                 <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm font-semibold">
//                                     Logout
//                                 </motion.button>
//                             </>
//                         ) : (
//                             <>
//                                 <Link to="/login" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Login</Link>
//                                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                     <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm">
//                                         Sign Up Free
//                                     </Link>
//                                 </motion.div>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;
