import axios from 'axios'

export const login = user => {
  return axios
    .post('api/user/login', {
      username: user.username,
      password: user.password
    })
    .then(response => {
      console.log(response.data);
      localStorage.setItem('usertoken', response.data)
      return response.data;
    })
    .catch(err => {
      console.log(err)
    })
}