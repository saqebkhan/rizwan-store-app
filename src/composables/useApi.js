import { ref } from 'vue';
import axios from 'axios';
import { useToast } from './useToast';

const API_BASE = (import.meta.env.VITE_API_URL || 'https://rizwan-store-api.onrender.com') ;

export function useApi() {
    const loading = ref(false);
    const error = ref(null);
    const toast = useToast();

    const request = async (method, url, data = null, options = {}) => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await axios({
                method,
                url: `${API_BASE}${url}`,
                data,
                ...options
            });
            return response.data;
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Something went wrong';
            error.value = message;
            if (!options.silent) {
                toast.error(message);
            }
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        error,
        get: (url, options) => request('get', url, null, options),
        post: (url, data, options) => request('post', url, data, options),
        put: (url, data, options) => request('put', url, data, options),
        patch: (url, data, options) => request('patch', url, data, options),
        delete: (url, options) => request('delete', url, null, options)
    };
}
