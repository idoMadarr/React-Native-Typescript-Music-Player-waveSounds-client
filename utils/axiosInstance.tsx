import axios from 'axios';
import Config from 'react-native-config';

const development = Config.localhost;
const production = Config.production;

const axiosInstance = axios.create({
  baseURL: development,
  timeout: 15000,
});

export default axiosInstance;
