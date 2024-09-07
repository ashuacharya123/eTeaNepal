// src/services/httpService.js
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation

const useHttpService = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function from react-router-dom

  const http = axios.create({
    baseURL: 'http://localhost:8000/api', // Replace with your API base URL
  });

  useEffect(() => {
    const requestInterceptor = http.interceptors.request.use(
      (config) => {
        setLoading(true); // Show loader on request
        return config;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    const responseInterceptor = http.interceptors.response.use(
      (response) => {
        setLoading(false); // Hide loader on response
        return response;
      },
      (error) => {
        setLoading(false);
        
        // Check if the error status is 505
        if (error.response && error.response.status === 505) {
          navigate('/505'); // Redirect to the 505 error page
        }

        return Promise.reject(error);
      }
    );

    return () => {
      http.interceptors.request.eject(requestInterceptor);
      http.interceptors.response.eject(responseInterceptor);
    };
  }, [http, navigate]); // Add 'navigate' to the dependency array

  return { http, loading };
};

export default useHttpService;
