import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
const apiUrl = process.env.VITE_API_URL;


const SignupForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!email) {
            setError('Name is required.');
            return false;
        }
        if (!password) {
            setError('Password is required.');
            return false;
        }
        if (!confirmPassword) {
            setError('Confirm password is required.');
            return false;
        }
        if (!username) {
            setError('Username is required.');
            return false;
        }
        if (username.length < 3) {
            setError('Username must be at least 3 characters long.');
            return false;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return false;
        }
        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return false;
        }

        return true; // form is valid
    };

    const evaluatePasswordStrength = (password: string) => {
        let strengthMessage = '';
        if (password.length < 8) {
            strengthMessage = 'Weak: Password is too short.';
        } else if (!/[a-z]/.test(password)) {
            strengthMessage = 'Weak: Add lowercase letters.';
        } else if (!/[A-Z]/.test(password)) {
            strengthMessage = 'Weak: Add uppercase letters.';
        } else if (!/[0-9]/.test(password)) {
            strengthMessage = 'Weak: Add numbers.';
        } else {
            strengthMessage = 'Strong password!';
        }
        setPasswordStrength(strengthMessage);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/v1/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password }),
            });

            if (!response.ok) {
                throw new Error('Failed to sign up');
            }

            const data = await response.json();
            console.log('User signed up successfully:', data);

            authContext?.login(data.access_token);
            navigate('/');
        } catch (error) {
            console.error('Error during signup:', error);
            setError('Signup failed. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSignup} className="bg-blue-200 p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
                {error && <p className="text-red-500">{error}</p>}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            evaluatePasswordStrength(e.target.value);
                        }}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    <div className="text-sm text-gray-600">{passwordStrength}</div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Sign Up
                    </button>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500 hover:text-blue-700 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default SignupForm;
