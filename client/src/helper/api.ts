import axios from 'axios'
import { API_BASE_URL, API_DOMAIN } from '../pre-start/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
})
export default api;

export const toUri = (subpath: string): string => {
  return `${API_DOMAIN}/${subpath}`;
}

/** Sets the default authorization for API */
export function setToken(token: string) {
  api.defaults.headers.common["Authorization"] = token;
}
