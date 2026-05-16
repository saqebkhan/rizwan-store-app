import { useApi } from '../composables/useApi';

const api = useApi();

export const productService = {
  getAll: (params) => api.get('/api/products', { params }),
  getFeatured: () => api.get('/api/products?featured=true'),
  getOne: (slug) => api.get(`/api/products/${slug}`),
  getSuggestions: (q) => api.get(`/api/products/suggestions?q=${q}`, { silent: true }),
  create: (formData) => api.post('/api/products', formData),
  update: (id, formData) => api.put(`/api/products/${id}`, formData),
  delete: (id) => api.delete(`/api/products/${id}`),
};

export const categoryService = {
  getAll: () => api.get('/api/categories'),
  create: (formData) => api.post('/api/categories', formData),
  delete: (id) => api.delete(`/api/categories/${id}`),
};

export const inquiryService = {
  getAll: () => api.get('/api/inquiries'),
  create: (data) => api.post('/api/inquiries', data),
  updateStatus: (id, status) => api.patch(`/api/inquiries/${id}/status`, { status }),
  getStats: () => api.get('/api/inquiries/stats'),
};

export const leadService = {
  getAll: () => api.get('/api/leads'),
  create: (data) => api.post('/api/leads', data),
  updateStatus: (id, status) => api.patch(`/api/leads/${id}`, { status }),
};

export const bannerService = {
  getAll: () => api.get('/api/banners'),
  getAllAdmin: () => api.get('/api/banners/all'),
  create: (formData) => api.post('/api/banners', formData),
  delete: (id) => api.delete(`/api/banners/${id}`),
};

export const notificationService = {
  subscribe: (subscription) => api.post('/api/notifications/subscribe', subscription),
  unsubscribe: (endpoint) => api.post('/api/notifications/unsubscribe', { endpoint }, { silent: true }),
};
