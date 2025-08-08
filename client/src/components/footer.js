import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white mt-16">
            <div className="container mx-auto py-8 px-4 text-center text-slate-500">
                <p>&copy; {new Date().getFullYear()} MarketMind. All Rights Reserved.</p>
                <p className="text-sm mt-2">Built with ❤️ in Greater Noida, India.</p>
            </div>
        </footer>
    );
};

export default Footer;