import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  async createAgent(config) {
    return axios.post(`${API_URL}/agents`, config);
  },

  async executeWorkflow(workflow) {
    return axios.post(`${API_URL}/workflow/execute`, workflow);
  },

  async getAgents() {
    return axios.get(`${API_URL}/agents`);
  },

  async getResults(workflowId) {
    return axios.get(`${API_URL}/workflow/${workflowId}`);
  }
};
