import api from './api';

const productService = {
  getAll: async (params) => {
    const response = await api.get('/api/products', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/api/products', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/products/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  },

  getLowStock: async () => {
    const response = await api.get('/api/products/low-stock');
    return response.data;
  }
};

export default productService;