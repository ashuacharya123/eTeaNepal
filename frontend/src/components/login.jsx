import React, { useState } from 'react';
import axios from 'axios';
import loginPhoto from "../Assets/login.png";
import { useAuth } from '../helper/context';
import { useNavigate,Link } from 'react-router-dom';

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false); // Set default to login
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '', // For signup
    confirmPassword: '' // For signup
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSwitchToSignup = () => {
    setIsSignup(true);
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
  };

  const handleSwitchToLogin = () => {
    setIsSignup(false);
    setFormData({ email: '', password: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      login(response.data['token']);
    

    // Store avatar and role in local storage
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/me', {
          headers: {
            'x-auth-token': localStorage.getItem('x-auth-token'),
          },
        });
        const { avatar, role, name } = response.data;
        localStorage.setItem('avatar', avatar);
        localStorage.setItem('name', name);
        localStorage.setItem('role', role);
      } catch (error) {
        
      }
    };
    
fetchUserData();
      navigate('/'); // Redirect to home page or any other page
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:8000/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/verify-otp'); // Redirect to verify OTP page
    } catch (error) {
      setError('Signup failed. Please check your details.');
    }
  };

  const loginFields = [
    {
      name: 'email',
      type: 'email',
      placeholder: 'jonhdoe@gmail.com',
      label: 'Email'
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'your password here',
      label: 'Password'
    }
  ];

  const signupFields = [
    {
      name: 'name',
      type: 'text',
      placeholder: 'John Doe',
      label: 'Name'
    },
    {
      name: 'email',
      type: 'email',
      placeholder: 'jonhdoe@gmail.com',
      label: 'Email'
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'your password here',
      label: 'Password'
    },
    {
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'confirm your password',
      label: 'Confirm Password'
    }
  ];

  return (
    <div className='container'>
      <div className='login__container'>
        <div className="login__container__content">
          <div className="login__container__content__upper">
            <h1>{isSignup ? 'Signup' : 'Login'}</h1>
            {isSignup && (
              <div>
                <Link to="/seller-signup">Are you a Seller? Seller Signup</Link>
              </div>
            )}
          </div>
          <div className="login__container__content__lower">
            <div className="login__container__content__lower__left">
              <img src={loginPhoto} alt="Login" />
            </div>
            <div className="login__container__content__lower__right">
              {isSignup
                ? signupFields.map((field) => (
                    <div key={field.name}>
                      <label htmlFor={field.name}>{field.label}</label>
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  ))
                : loginFields.map((field) => (
                    <div key={field.name}>
                      <label htmlFor={field.name}>{field.label}</label>
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  ))}
              <button onClick={isSignup ? handleSignup : handleLogin}>
                {isSignup ? 'Signup' : 'Login'}
              </button>
              {error && <p className="error">{error}</p>}
              <div>
                {isSignup ? (
                  <p>Already signed up? <a href="#" onClick={handleSwitchToLogin}>Login</a></p>
                ) : (
                  <p>New here? <a href="#" onClick={handleSwitchToSignup}>Sign up</a></p>
                )}
              </div>
              {!isSignup &&
                  <Link to="/forgot-password">Forgot Password?</Link>
                }
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
