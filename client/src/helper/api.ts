import axios from 'axios'
import { API_BASE_URL, API_DOMAIN } from '../pre-start/constants';

export default axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
})

export const toUri = (subpath: string): string => {
  return `${API_DOMAIN}/${subpath}`;
}
