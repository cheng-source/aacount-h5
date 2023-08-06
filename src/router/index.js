import Home from '@/container/Home'
import Data from '@/container/Data'
import User from '@/container/User'

const routes = [{
        path: '/',
        component: Home
    }, {
        path: "/user",
        component: User
    },
    {
        path: 'data',
        component: Data
    },

];
export default routes