import {clsx} from 'clsx';
import Cookies from 'js-cookie';
import {twMerge} from 'tailwind-merge';
import {TOKEN} from './apis/keywords';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

async function apiRequest(url, method = 'GET', body = null) {
  const token = Cookies.get(TOKEN);

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    next: {
      revalidate: 0,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export const createSlug = name => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

export const get = url => apiRequest(url, 'GET');
export const post = (url, body) => apiRequest(url, 'POST', body);
export const put = (url, body) => apiRequest(url, 'PUT', body);
export const del = url => apiRequest(url, 'DELETE');
