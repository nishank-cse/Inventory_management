import api from './api';

const reportService = {
  getSummary: async () => {
    const response = await api.get('/api/reports/summary');
    return response.data;
  },

  getStockMovement: async (startDate, endDate) => {
    const response = await api.get('/api/reports/stock-movement', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  downloadPDF: async () => {
    const response = await api.get('/api/export/products/pdf', {
      responseType: 'blob'
    });
    return response.data;
  },

  downloadExcel: async () => {
    const response = await api.get('/api/export/products/excel', {
      responseType: 'blob'
    });
    return response.data;
  }
};

export default reportService;