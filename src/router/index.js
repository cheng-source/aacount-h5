import Home from '@/container/Home'
import Data from '@/container/Data'
import User from '@/container/User'
import Login from '@/container/Login';
import Detail from '@/container/Detail';
import UserInfo from '@/container/UserInfo/index.jsx';
import Account from '../container/Account';

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
    {
        path: '/login',
        component: Login
    },
    {
        path: '/detail',
        component: Detail
    },
    {
        path: '/userInfo',
        component: UserInfo
    },
    {
        path: '/account',
        component: Account
    }

];
export default routes