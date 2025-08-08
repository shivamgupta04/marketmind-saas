import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardPage = () => {
    const { user, updateUserCredits } = useAuth();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [generatedListing, setGeneratedListing] = useState(null);
    const [pastListings, setPastListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.token) {
            const fetchPastListings = async () => {
                try {
                    const { data } = await axios.get('http://localhost:5000/api/products/my-listings', {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    setPastListings(data);
                } catch (err) {
                    console.error("Could not fetch past listings");
                }
            };
            fetchPastListings();
        }
    }, [user?.token]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select an image.');
            return;
        }
        setLoading(true);
        setError('');
        setGeneratedListing(null);

        const formData = new FormData();
        formData.append('productImage', file);

        try {
            const { data } = await axios.post('http://localhost:5000/api/products/generate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            });
            setGeneratedListing(data.product);
            setPastListings([data.product, ...pastListings]);
            updateUserCredits(data.remainingCredits);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleBuyCredits = async (packId) => {
        try {
            const { data: order } = await axios.post('http://localhost:5000/api/billing/create-order', { packId }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            const options = {
                key: "rzp_test_Zk3oPAOJaKOMk2", // IMPORTANT: Enter your Key ID from Razorpay Dashboard
                amount: order.amount,
                currency: order.currency,
                name: "MarketMind",
                description: "Credits Purchase",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const { data: verificationData } = await axios.post('http://localhost:5000/api/billing/verify-payment', {
                            // Pass the entire response object from Razorpay
                            ...response,
                            packId,
                        }, {
                            headers: { Authorization: `Bearer ${user.token}` }
                        });

                        if (verificationData.success) {
                            alert("Payment successful! Credits added.");
                            updateUserCredits(verificationData.newCredits);
                        } else {
                            alert(verificationData.message || "Payment verification failed. Please contact support.");
                        }
                    } catch (error) {
                        console.error("Payment verification failed:", error);
                        alert(error.response?.data?.message || "Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#2563eb" // Tailwind's blue-600
                }
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error("Payment failed", error);
            alert("Could not initiate payment. Please check the console for details.");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
            {/* Left Column: Generator */}
            <motion.div 
                className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/70"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-2xl font-bold mb-4 text-slate-800">Generate New Listing</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                        <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
                        <label htmlFor="file-upload" className="cursor-pointer text-blue-600 font-semibold">
                            <i className="fas fa-cloud-upload-alt text-2xl mb-2"></i>
                            <p>{file ? file.name : 'Choose an image'}</p>
                        </label>
                        {preview && <img src={preview} alt="Preview" className="mt-4 mx-auto h-32 rounded-lg shadow-md" />}
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading || !file} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                        {loading ? <span className="spinner"></span> : 'Generate Listing'}
                    </motion.button>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                </form>
                
                <div className="mt-8 pt-6 border-t border-slate-200">
                    <h3 className="text-xl font-bold mb-4 text-slate-800">Buy More Credits</h3>
                    <div className="space-y-3">
                         <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleBuyCredits('50')} className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition font-semibold">Buy 50 Credits (₹499)</motion.button>
                         <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleBuyCredits('150')} className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition font-semibold">Buy 150 Credits (₹1199)</motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Right Column: Results */}
            <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <AnimatePresence>
                {generatedListing && (
                    <motion.div 
                        className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/70 mb-8"
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h3 className="text-2xl font-bold text-slate-800">{generatedListing.title}</h3>
                        <p className="text-lg font-semibold text-green-600 mt-1">Suggested Price: ₹{generatedListing.suggestedPrice}</p>
                        <p className="text-slate-600 my-4">{generatedListing.description}</p>
                        <ul className="space-y-2 list-disc list-inside">
                            {generatedListing.bulletPoints.map((point, i) => <li key={i} className="text-gray-700">{point}</li>)}
                        </ul>
                    </motion.div>
                )}
                </AnimatePresence>
                
                <h2 className="text-2xl font-bold mb-4 text-slate-800">Your Past Listings</h2>
                <div className="space-y-4">
                    {pastListings.length > 0 ? (
                        pastListings.map((item, index) => (
                            <motion.div 
                                key={item._id} 
                                className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                            >
                                <h4 className="font-bold text-slate-800">{item.title}</h4>
                                <p className="text-sm text-slate-500">{item.imageQuery}</p>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl shadow-md">
                            <i className="fas fa-history text-4xl text-slate-400 mb-4"></i>
                            <p className="text-slate-500">You haven't generated any listings yet.</p>
                            <p className="text-sm text-slate-400">Your past creations will appear here.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardPage;