import axios from 'axios'

const instance = axios.create({
    baseURL: '/xxx',
    withCredentials: true
})

instance.interceptors.request.use(config => config)
