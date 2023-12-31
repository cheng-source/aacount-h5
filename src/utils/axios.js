import axios from "axios";
import { Toast } from "antd-mobile";

const MODE =
    import.meta.env.MODE;

console.log(MODE);
axios.defaults.baseURL == 'development' ? '/api' : 'http://localhost:7002'

axios.defaults.withCredentials = true // 表示跨域请求需要凭证
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Authorization'] = `${localStorage.getItem('token') || null}`
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use(res => {
    if (typeof res.data !== 'object') {
        Toast.show('服务端异常！')
        return Promise.reject(res)
    }
    if (res.data.code != 200) {
        console.log(res.data.msg);
        if (res.data.msg) Toast.show(res.data.msg)
        if (res.data.code == 401) {
            window.location.href = '/login'
        }
        return Promise.reject(res.data)
    }

    return res.data
})

export default axios