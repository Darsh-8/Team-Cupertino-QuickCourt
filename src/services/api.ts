// API configuration and service functions
const API_BASE_URL = 'http://localhost:5000/api';

// API client with error handling
class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse(response: Response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  }

  async get(endpoint: string) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async post(endpoint: string, body: any) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse(response);
  }

  async put(endpoint: string, body: any) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse(response);
  }

  async delete(endpoint: string) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// Authentication API
export const authAPI = {
  register: async (userData: {
    fullName: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data.token) {
      apiClient.setToken(response.data.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userRole', response.data.user.role);
    }
    return response;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.token) {
      apiClient.setToken(response.data.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', credentials.email);
      localStorage.setItem('userRole', response.data.user.role);
    }
    return response;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      apiClient.clearToken();
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
    }
  },

  getProfile: async () => {
    return await apiClient.get('/auth/profile');
  },

  verifyOTP: async (email: string, otpCode: string) => {
    const response = await apiClient.post('/auth/verify-otp', { email, otpCode });
    if (response.data.token) {
      apiClient.setToken(response.data.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', response.data.user.role);
    }
    return response;
  }
};

// Venues API
export const venuesAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    sport?: string;
    location?: string;
    priceMin?: number;
    priceMax?: number;
    rating?: number;
    sortBy?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const endpoint = `/venues${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get(endpoint);
  },

  getById: async (id: string) => {
    return await apiClient.get(`/venues/${id}`);
  },

  getPopular: async () => {
    return await apiClient.get('/venues/popular');
  },

  getFeatured: async () => {
    return await apiClient.get('/venues/featured');
  },

  search: async (query: string, location?: string) => {
    const params = new URLSearchParams({ q: query });
    if (location) params.append('location', location);
    return await apiClient.get(`/venues/search?${params.toString()}`);
  },

  getCourts: async (venueId: string, sport?: string) => {
    const params = sport ? `?sport=${sport}` : '';
    return await apiClient.get(`/venues/${venueId}/courts${params}`);
  },

  getReviews: async (venueId: string, page = 1, limit = 10) => {
    return await apiClient.get(`/venues/${venueId}/reviews?page=${page}&limit=${limit}`);
  },

  createReview: async (venueId: string, reviewData: { rating: number; comment?: string }) => {
    return await apiClient.post(`/venues/${venueId}/reviews`, reviewData);
  }
};

// Bookings API
export const bookingsAPI = {
  create: async (bookingData: {
    venueId: number;
    courtId: number;
    bookingDate: string;
    startTime: string;
    endTime: string;
    duration: number;
  }) => {
    return await apiClient.post('/bookings', bookingData);
  },

  getMyBookings: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    sport?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const endpoint = `/bookings/my-bookings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get(endpoint);
  },

  getById: async (id: string) => {
    return await apiClient.get(`/bookings/${id}`);
  },

  cancel: async (id: string) => {
    return await apiClient.put(`/bookings/${id}/cancel`, {});
  },

  checkAvailability: async (courtId: number, date: string) => {
    return await apiClient.get(`/bookings/availability?courtId=${courtId}&date=${date}`);
  },

  getStats: async () => {
    return await apiClient.get('/bookings/stats');
  }
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    return await apiClient.get('/users/profile');
  },

  updateProfile: async (profileData: { fullName?: string; email?: string }) => {
    return await apiClient.put('/users/profile', profileData);
  },

  getBookings: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    sport?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const endpoint = `/users/bookings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get(endpoint);
  },

  getReviews: async (page = 1, limit = 10) => {
    return await apiClient.get(`/users/reviews?page=${page}&limit=${limit}`);
  }
};

export default apiClient;