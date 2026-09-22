const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to perform fetch requests with error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    ...options.headers,
  };

  // Only add Content-Type: application/json if body is not FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Attach auth token if available in localStorage
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Error en la solicitud: ${response.statusText}`);
  }

  return data;
}

export const api = {
  // --- Productos ---
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.location) query.append('location', params.location);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/products${queryString}`);
  },

  getProductById: (id) => {
    return request(`/products/${id}`);
  },

  createProduct: (formData) => {
    return request('/products', {
      method: 'POST',
      body: formData,
    });
  },

  updateProduct: (id, formData) => {
    return request(`/products/${id}`, {
      method: 'PUT',
      body: formData,
    });
  },

  deleteProduct: (id) => {
    return request(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  getMyListings: () => {
    return request('/products/user/my-listings');
  },

  // --- Autenticación ---
  register: (userData) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: (credentials) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getMe: () => {
    return request('/auth/me');
  },
};

export default api;
