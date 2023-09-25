import axios from 'axios';
import { API_KEY } from './config';

const BASE_URL = 'https://api.thecatapi.com/v1/';

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['x-api-key'] = API_KEY;

export async function fetchBreeds() {
  try {
    const response = await axios.get('breeds');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchCatByBreed(breedId) {
  try {
    const response = await axios.get(`images/search?breed_ids=${breedId}`);
    return response.data[0];
  } catch (error) {
    throw error;
  }
}
