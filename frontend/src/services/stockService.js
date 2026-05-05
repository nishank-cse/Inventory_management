import api from './api';

const stockService = {
  stockIn: async (data) => {
    const response = await api.post('/api/stock/in', data);
    return response.data;
  },

  stockOut: async (data) => {
    const response = await api.post('/api/stock/out', data);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/api/stock/history');
    return response.data;
  }
};

export default stockService;