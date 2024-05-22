import axios from 'axios';

class AuthService {
  constructor() {
    this.tokenKey = 'token';
    this.userKey = 'user';
  }

  async login(email, password) {
    const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    return user;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated() {
    return !!localStorage.getItem(this.tokenKey);
  }

  getUser() {
    return JSON.parse(localStorage.getItem(this.userKey));
  }
}

export default new AuthService();
