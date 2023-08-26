import axios from "./axios";

export const get = axios.get;

export const post = axios.post;

export const LOAD_STATE = {
    normal: 0, //普通或加载完毕
    loading: 1, // 加载中
}

export const REFRESH_STATE = {
    normal: 0, //普通或加载完毕
    pull: 1,
    loading: 2, // 加载中
    complete: 3,
    fail: 4,
    success: 5
}