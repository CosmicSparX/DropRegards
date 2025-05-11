import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';

// Create API base instance
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized errors by redirecting to login
    if (error.response?.status === 401) {
      // Clear authentication data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('wallet_address');
      localStorage.removeItem('user_profile');
      
      // If in browser environment, redirect to home page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to check if API is available
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/');
    return response.status === 200;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

// API endpoints for authentication
export const authApi = {
  getNonce: async (walletAddress: string) => {
    try {
      const response = await api.post('/auth/nonce', { walletAddress });
      return response.data;
    } catch (error) {
      console.error('Error getting nonce:', error);
      throw error;
    }
  },
  
  verifySignature: async (walletAddress: string, signature: string, nonce: string) => {
    try {
      const response = await api.post('/auth/verify-signature', {
        walletAddress,
        signature,
        nonce,
      });
      
      // Store token in local storage for future requests
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('wallet_address', walletAddress);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error verifying signature:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Always clear local storage on logout
      localStorage.removeItem('auth_token');
      localStorage.removeItem('wallet_address');
      localStorage.removeItem('user_profile');
      return { success: true };
    }
  },
};

// API endpoints for user profile
export const userApi = {
  checkUsername: async (username: string) => {
    const response = await api.get(`/users/check-username?username=${username}`);
    return response.data;
  },
  
  createProfile: async (profileData: {
    username: string;
    displayName?: string;
    bio?: string;
    profileImage?: string;
  }) => {
    const response = await api.post('/users/profile', profileData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/users/profile');
    // Cache user profile
    localStorage.setItem('user_profile', JSON.stringify(response.data));
    return response.data;
  },
  
  updateProfile: async (profileData: {
    displayName?: string;
    bio?: string;
    profileImage?: string;
  }) => {
    const response = await api.put('/users/profile', profileData);
    // Update cached profile
    localStorage.setItem('user_profile', JSON.stringify(response.data));
    return response.data;
  },
  
  getUserByUsername: async (username: string) => {
    const response = await api.get(`/users/username/${username}`);
    return response.data;
  },
};

// API endpoints for regards
export const regardsApi = {
  sendRegard: async (regardData: {
    recipient: string;
    amount: number;
    message: string;
    includeNft: boolean;
    nftDesign?: string;
    transactionSignature: string;
  }) => {
    const response = await api.post('/regards/send', regardData);
    return response.data;
  },
  
  getRegards: async (limit = 10, offset = 0) => {
    const response = await api.get(`/regards/list?limit=${limit}&offset=${offset}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/regards/stats');
    return response.data;
  },
  
  getPublicStats: async (username: string) => {
    const response = await api.get(`/regards/public-stats/${username}`);
    return response.data;
  },
};

// API endpoints for NFTs
export const nftApi = {
  getTemplates: async () => {
    const response = await api.get('/nft/templates');
    return response.data;
  },
  
  generateMetadata: async (metadataParams: {
    templateId: string;
    recipient: string;
    message: string;
    amount: number;
  }) => {
    const response = await api.post('/nft/metadata', metadataParams);
    return response.data;
  },
  
  getCollection: async () => {
    const response = await api.get('/nft/collection');
    return response.data;
  },
};

export default api; 