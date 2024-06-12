import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <h1 className=" text-blue-300 text-4xl font-bold mb-8">Welcome to the Image Search Engine</h1>
      <div>
        <Link to="/signup" className="mr-4 text-blue-500 hover:underline hover:text-blue-700">Signup</Link>
        <Link to="/login" className="text-blue-500 hover:underline hover:text-blue-700">Login</Link>
      </div>
    </div>
  );
};

export default Home;
