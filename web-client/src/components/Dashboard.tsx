import React from 'react';
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const authContext = useContext(AuthContext);
    const navigate  = useNavigate();

    const handleLogout = () => {
        authContext?.logout();
        navigate('/');
    };

    const handleSearchPage = () => {
        navigate('/image-search');
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4 bg-black text-white overflow-y-auto">
            <div className="w-full max-w-6xl flex justify-between items-center mb-24">
                <h1 className="text-3xl font-bold text-blue-300">Dashboard</h1>
                <div className="flex space-x-16">
                    <button
                        onClick={handleSearchPage}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Image Search
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>
            <main className="flex-grow w-full max-w-6xl space-y-12">
                <div className='mb-20'>
                    <ImageUpload />
                </div>
                <ImageGallery />
            </main>
        </div>
    );
};

export default Dashboard;

