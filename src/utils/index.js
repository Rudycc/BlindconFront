import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://blindcon.galaxiaskyklos.com',
  auth: {
    username: 'admin',
    password: 'password',
  },
});

export {
  instance,
}
