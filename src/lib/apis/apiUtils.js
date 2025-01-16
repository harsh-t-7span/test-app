import {TOKEN} from './keywords';
import Cookies from 'js-cookie';

/**
 * Creates headers for API requests, including optional authorization and dynamic content type.
 * @param {Object} [additionalHeaders={}] - Additional headers to include in the request.
 * @returns {Object} - The headers object for the API request.
 */
export function authHeader(additionalHeaders = {}) {
  const token = Cookies.get(TOKEN);

  // Default headers
  let headers = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  // Add Authorization header if token is present
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Makes an API request with dynamic method, headers, and body.
 * @param {string} url - The API endpoint URL.
 * @param {string} method - The HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @param {Object} [headers={}] - Optional headers to include in the request.
 * @param {Object} [body=null] - Optional body to include in the request (for methods like POST, PUT).
 * @returns {Promise<Object>} - The response data.
 */
export const apiRequest = async (
  url,
  method = 'GET',
  headers = {},
  body = null,
) => {
  try {
    // Ensure body is not null for methods that require it
    const options = {
      method,
      headers: {...authHeader(), ...headers},
      body:
        method === 'GET' || method === 'HEAD'
          ? undefined
          : body
          ? JSON.stringify(body)
          : null,
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error('There was a problem with your fetch operation:', error);
    throw error;
  }
};
