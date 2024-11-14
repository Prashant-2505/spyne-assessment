import axios from 'axios';

const API_URL ="https://spyne-assessment.onrender.com/api"
console.log("hii")
console.log(API_URL); //

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
