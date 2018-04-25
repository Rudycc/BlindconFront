import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://blindcon.galaxiaskyklos.com:3001',
  auth: {
    username: 'admin',
    password: 'password',
  },
});

export {
  instance,
}
