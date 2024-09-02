// src/services/httpService.js
import axios from 'axios';
import { useState, useEffect } from 'react';

const useHttpService = () => {
  const [loading, setLoading] = useState(false);

  const http = axios.create({
    baseURL: 'http://localhost:8000/api', // Replace with your API base URL
  });

  useEffect(() => {
    const requestInterceptor = http.interceptors.request.use((config) => {
      setLoading(true); // Show loader on request
      return config;
    }, (error) => {
      setLoading(false);
      return Promise.reject(error);
    });

    const responseInterceptor = http.interceptors.response.use((response) => {
      setLoading(false); // Hide loader on response
      return response;
    }, (error) => {
      setLoading(false);
      return Promise.reject(error);
    });

    return () => {
      http.interceptors.request.eject(requestInterceptor);
      http.interceptors.response.eject(responseInterceptor);
    };
  }, [http]);

  return { http, loading };
};

export default useHttpService;
