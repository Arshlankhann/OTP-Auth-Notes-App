
import axios from 'axios';
import authService from './authService';

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/notes`;

const getAuthHeaders = () => {
    const token = authService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const getNotes = async () => {
    const response = await axios.get(API_URL, { headers: getAuthHeaders() });
    return response.data;
};

const createNote = async (noteData) => {
    const response = await axios.post(API_URL, noteData, { headers: getAuthHeaders() });
    return response.data;
};

const deleteNote = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return response.data;
};

const noteService = {
    getNotes,
    createNote,
    deleteNote,
};

export default noteService;