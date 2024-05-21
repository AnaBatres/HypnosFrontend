import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

export default {
    getUser(username) {
        return axios.get(`${API_URL}/${username}`);
    },
    updateUser(user) {
        return axios.put(`${API_URL}/${user.id}`, user);
    }
};