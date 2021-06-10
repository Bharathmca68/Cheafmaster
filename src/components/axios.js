import axios from 'axios'

const instance = axios.create({
    baseURL : 'https://gentle-wave-50371.herokuapp.com',
})

export default instance;