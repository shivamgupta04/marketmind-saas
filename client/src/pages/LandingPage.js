import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="text-center py-16">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
                Generate E-commerce Listings in Seconds
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Stop wasting time writing product descriptions. Upload an image, and let our AI create compelling, high-converting listings for you.
            </p>
            <div className="flex justify-center space-x-4">
                <Link to="/register" className="bg-blue-500 text-white text-lg px-8 py-3 rounded-full font-semibold hover:bg-blue-600 transition-transform transform hover:scale-105">
                    Get Started for Free
                </Link>
                <Link to="/login" className="bg-gray-200 text-gray-800 text-lg px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition-transform transform hover:scale-105">
                    I have an account
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;

// import React from 'react';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';

// const FeatureCard = ({ icon, title, children }) => (
//     <motion.div 
//         className="bg-white p-6 rounded-xl shadow-lg text-center"
//         whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
//     >
//         <div className="text-4xl text-blue-600 mb-4">{icon}</div>
//         <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
//         <p className="text-slate-600">{children}</p>
//     </motion.div>
// );

// const PricingCard = ({ title, price, features, isFeatured }) => (
//     <motion.div 
//         className={`bg-white p-8 rounded-2xl shadow-lg border-2 ${isFeatured ? 'border-blue-600' : 'border-transparent'}`}
//         whileHover={{ scale: 1.03 }}
//     >
//         {isFeatured && <p className="text-center bg-blue-600 text-white text-sm font-bold py-1 px-4 rounded-full -mt-12 mb-4 inline-block">Most Popular</p>}
//         <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
//         <p className="text-4xl font-extrabold my-4">₹{price}<span className="text-lg font-medium text-slate-500">/pack</span></p>
//         <ul className="space-y-3 my-6">
//             {features.map((feature, i) => (
//                 <li key={i} className="flex items-center gap-3">
//                     <i className="fas fa-check-circle text-green-500"></i>
//                     <span className="text-slate-600">{feature}</span>
//                 </li>
//             ))}
//         </ul>
//         <Link to="/register" className={`w-full block text-center py-3 rounded-lg font-semibold transition-colors ${isFeatured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'}`}>
//             Get Started
//         </Link>
//     </motion.div>
// );


// const LandingPage = () => {
//     return (
//         <div className="space-y-24 md:space-y-32 my-16">
//             {/* Hero Section */}
//             <motion.section 
//                 className="text-center"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.7 }}
//             >
//                 <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-4 leading-tight">
//                     Generate E-commerce Listings <br /> in <span className="text-blue-600">Seconds</span>.
//                 </h1>
//                 <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
//                     Stop wasting time writing product descriptions. Upload an image, and let our AI create compelling, high-converting listings for you.
//                 </p>
//                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                     <Link to="/register" className="bg-blue-600 text-white text-lg px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
//                         Get Started for Free <i className="fas fa-arrow-right ml-2"></i>
//                     </Link>
//                 </motion.div>
//             </motion.section>

//             {/* Features Section */}
//             <section id="features" className="text-center">
//                 <h2 className="text-3xl md:text-4xl font-bold mb-12">Why Choose MarketMind?</h2>
//                 <div className="grid md:grid-cols-3 gap-8">
//                     <FeatureCard icon="📸" title="Vision AI">
//                         Our AI sees and understands your product from just a photo. No manual data entry needed.
//                     </FeatureCard>
//                     <FeatureCard icon="✍️" title="Expert Copywriting">
//                         Generates persuasive titles, descriptions, and bullet points that are optimized for sales.
//                     </FeatureCard>
//                     <FeatureCard icon="💰" title="Smart Pricing">
//                         Suggests competitive prices by analyzing similar products across the web in real-time.
//                     </FeatureCard>
//                 </div>
//             </section>

//             {/* Pricing Section */}
//             <section id="pricing" className="text-center">
//                 <h2 className="text-3xl md:text-4xl font-bold mb-12">Simple, Transparent Pricing</h2>
//                 <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
//                     <PricingCard title="Starter Pack" price="499" features={['50 Credits', 'Email Support', 'Access to all features']} />
//                     <PricingCard title="Business Pack" price="1199" features={['150 Credits', 'Priority Support', 'Access to all features']} isFeatured />
//                     <PricingCard title="Free Trial" price="0" features={['5 Credits', 'On Signup', 'No credit card required']} />
//                 </div>
//             </section>
//         </div>
//     );
// };

// export default LandingPage;