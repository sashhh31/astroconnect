// API Client for Frontend Integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new APIError(
      data.message || 'An error occurred',
      response.status,
      data.details || data.errors
    );
  }

  return data.data as T;
}

// Auth API
export const authAPI = {
  register: (data: {
    email: string;
    phone: string;
    password: string;
    fullName: string;
  }) => fetchAPI('/user/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (data: { email: string; password: string }) =>
    fetchAPI<{ accessToken: string; refreshToken: string; user: any }>(
      '/user/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),

  logout: () => fetchAPI('/user/auth/logout', { method: 'POST' }),

  verifyOTP: (data: { phone: string; token: string }) =>
    fetchAPI('/user/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// User API
export const userAPI = {
  getProfile: () => fetchAPI('/user/profile'),
  
  updateProfile: (data: any) =>
    fetchAPI('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_BASE_URL}/user/profile/upload-avatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: formData,
    }).then(res => res.json());
  },
};

// Wallet API
export const walletAPI = {
  getBalance: () => fetchAPI('/user/wallet/balance'),
  
  getTransactions: (page = 1, limit = 10) =>
    fetchAPI(`/user/wallet/transactions?page=${page}&limit=${limit}`),
  
  recharge: (data: { amount: number; paymentMethod: string }) =>
    fetchAPI('/user/wallet/recharge', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Astrologers API
export const astrologersAPI = {
  list: (page = 1, limit = 10) =>
    fetchAPI(`/user/astrologers?page=${page}&limit=${limit}`),
  
  get: (id: string) => fetchAPI(`/user/astrologers/${id}`),
  
  search: (query: string, page = 1) =>
    fetchAPI(`/user/astrologers/search?q=${encodeURIComponent(query)}&page=${page}`),
  
  filter: (filters: any) => {
    const params = new URLSearchParams(filters).toString();
    return fetchAPI(`/user/astrologers/filter?${params}`);
  },
  
  nearby: (lat: number, lng: number, radius = 10) =>
    fetchAPI(`/user/astrologers/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
};

// Consultations API
export const consultationsAPI = {
  list: (page = 1) => fetchAPI(`/user/consultations?page=${page}`),
  
  get: (id: string) => fetchAPI(`/user/consultations/${id}`),
  
  book: (data: {
    astrologerId: string;
    type: 'chat' | 'voice_call' | 'video_call';
    duration: number;
  }) =>
    fetchAPI('/user/consultations/book', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  cancel: (id: string) =>
    fetchAPI(`/user/consultations/${id}/cancel`, { method: 'PUT' }),
  
  review: (id: string, data: { rating: number; review?: string }) =>
    fetchAPI(`/user/consultations/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Chat API
export const chatAPI = {
  getMessages: (consultationId: string) =>
    fetchAPI(`/communication/chat/${consultationId}/messages`),
  
  sendMessage: (consultationId: string, data: { content: string; type?: string }) =>
    fetchAPI(`/communication/chat/${consultationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  markAsRead: (consultationId: string) =>
    fetchAPI(`/communication/chat/${consultationId}/read`, { method: 'PUT' }),
};

// Call API
export const callAPI = {
  getToken: (consultationId: string) =>
    fetchAPI<{ token: string; channelName: string; uid: string; appId: string }>(
      `/communication/call/${consultationId}/token`
    ),
  
  initiate: (consultationId: string) =>
    fetchAPI('/communication/call/initiate', {
      method: 'POST',
      body: JSON.stringify({ consultationId }),
    }),
  
  end: (consultationId: string) =>
    fetchAPI('/communication/call/end', {
      method: 'POST',
      body: JSON.stringify({ consultationId }),
    }),
};

// Video API
export const videoAPI = {
  getToken: (consultationId: string) =>
    fetchAPI<{ token: string; channelName: string; uid: string; appId: string }>(
      `/communication/video/${consultationId}/token`
    ),
  
  initiate: (consultationId: string) =>
    fetchAPI('/communication/video/initiate', {
      method: 'POST',
      body: JSON.stringify({ consultationId }),
    }),
  
  end: (consultationId: string) =>
    fetchAPI('/communication/video/end', {
      method: 'POST',
      body: JSON.stringify({ consultationId }),
    }),
};

// Horoscope API
export const horoscopeAPI = {
  daily: (sign: string) => fetchAPI(`/user/horoscope/daily/${sign}`),
  weekly: (sign: string) => fetchAPI(`/user/horoscope/weekly/${sign}`),
  monthly: (sign: string) => fetchAPI(`/user/horoscope/monthly/${sign}`),
  compatibility: (sign1: string, sign2: string) =>
    fetchAPI(`/user/horoscope/compatibility?sign1=${sign1}&sign2=${sign2}`),
};

// Astrologer API
export const astrologerAPI = {
  // Auth
  login: (data: { email: string; password: string }) =>
    fetchAPI('/astrologer/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  register: (data: any) =>
    fetchAPI('/astrologer/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  logout: () => fetchAPI('/astrologer/auth/logout', { method: 'POST' }),
  
  // Profile
  getProfile: () => fetchAPI('/astrologer/profile'),
  
  updateProfile: (data: any) =>
    fetchAPI('/astrologer/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  updatePricing: (data: any) =>
    fetchAPI('/astrologer/profile/pricing', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  uploadAvatar: (formData: FormData) =>
    fetchAPI('/astrologer/profile/upload-avatar', {
      method: 'POST',
      body: formData,
    }),
  
  // Status
  setOnline: () =>
    fetchAPI('/astrologer/status/online', { method: 'PUT' }),
  
  setOffline: () =>
    fetchAPI('/astrologer/status/offline', { method: 'PUT' }),
  
  // Dashboard
  getDashboard: () => fetchAPI('/astrologer/dashboard'),
  
  // Consultations
  getConsultations: (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return fetchAPI(`/astrologer/consultations${query}`);
  },
  
  getPendingConsultations: () => fetchAPI('/astrologer/consultations/pending'),
  
  getTodayConsultations: () => fetchAPI('/astrologer/consultations/today'),
  
  getConsultation: (id: string) => fetchAPI(`/astrologer/consultations/${id}`),
  
  acceptConsultation: (id: string) =>
    fetchAPI(`/astrologer/consultations/${id}/accept`, { method: 'PUT' }),
  
  rejectConsultation: (id: string) =>
    fetchAPI(`/astrologer/consultations/${id}/reject`, { method: 'PUT' }),
  
  startConsultation: (id: string) =>
    fetchAPI(`/astrologer/consultations/${id}/start`, { method: 'PUT' }),
  
  endConsultation: (id: string) =>
    fetchAPI(`/astrologer/consultations/${id}/end`, { method: 'PUT' }),
  
  addConsultationNotes: (id: string, notes: string) =>
    fetchAPI(`/astrologer/consultations/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),
  
  // Clients
  getClients: () => fetchAPI('/astrologer/clients'),
  
  getClient: (id: string) => fetchAPI(`/astrologer/clients/${id}`),
  
  getClientHistory: (id: string) => fetchAPI(`/astrologer/clients/${id}/history`),
  
  // Earnings
  getEarnings: () => fetchAPI('/astrologer/earnings'),
  
  getEarningsSummary: () => fetchAPI('/astrologer/earnings/summary'),
  
  getEarningsTransactions: (page = 1) =>
    fetchAPI(`/astrologer/earnings/transactions?page=${page}`),
  
  requestWithdrawal: (amount: number, method: string) =>
    fetchAPI('/astrologer/earnings/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount, method }),
    }),
  
  // Analytics
  getAnalyticsEarnings: (period?: string) => {
    const query = period ? `?period=${period}` : '';
    return fetchAPI(`/astrologer/analytics/earnings${query}`);
  },
  
  getAnalyticsConsultations: (period?: string) => {
    const query = period ? `?period=${period}` : '';
    return fetchAPI(`/astrologer/analytics/consultations${query}`);
  },
  
  getAnalyticsRatings: () => fetchAPI('/astrologer/analytics/ratings'),
  
  getAnalyticsPerformance: () => fetchAPI('/astrologer/analytics/performance'),
  
  // Reviews
  getReviews: (page = 1) => fetchAPI(`/astrologer/reviews?page=${page}`),
  
  getReviewsStats: () => fetchAPI('/astrologer/reviews/stats'),
  
  replyToReview: (id: string, reply: string) =>
    fetchAPI(`/astrologer/reviews/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ reply }),
    }),
  
  // Availability
  getAvailability: () => fetchAPI('/astrologer/availability'),
  
  updateAvailability: (data: any) =>
    fetchAPI('/astrologer/availability', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export { APIError };
