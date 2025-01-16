import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from './apiUtils'; // Adjust import path
import { authHeader } from './apiUtils'; // Import the authHeader function

/**
 * Creates a dynamic async thunk for API requests.
 * @param {string} actionType - The action type string.
 * @param {string} url - The API endpoint URL.
 * @param {string} [method='GET'] - The HTTP method (e.g., 'GET', 'POST').
 * @param {Function} [prepareBody=null] - Function to prepare the body for the request (optional).
 * @returns {Function} - The created async thunk.
 */
export const createApiThunk = (actionType, urlTemplate, method = 'GET', prepareBody = null) => {
    return createAsyncThunk(
        actionType,
        async (payload = null, { rejectWithValue }) => {
            try {
                // Construct URL from the template function if provided
                const url = typeof urlTemplate === 'function' ? urlTemplate(payload) : urlTemplate;

                // Prepare the body only if the method is not GET or HEAD
                const body = method === 'GET' || method === 'HEAD' ? null : (prepareBody ? prepareBody(payload) : payload);
                
                // Fetch data using the apiRequest function
                const headers = authHeader();
                const data = await apiRequest(url, method, headers, body);

                return data;
            } catch (error) {
                return rejectWithValue(error.message || 'Failed to fetch data');
            }
        }
    );
};

