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

export function isElement(node) {
    const ELEMENT_NODE_TYPE = 1;
    return node.tagName !== 'HTML' && node.tagName !== 'BODY' && node.nodeType === ELEMENT_NODE_TYPE;
}

// 获取指定元素的可滚动父元素
export const getScrollParent = (node) => {
    while (isElement(node)) {
        const { overflowY } = window.getComputedStyle(node);
        if (/scroll|auto/i.test(overflowY)) {
            return node;
        }
        node = node.parentNode;
    }
}

// 节流
export const throttle = function(func, delay) {
    let timer = null;
    let startTime = Date.now();
    return function() {
        let curTime = Date.now();
        let remainTime = delay - (curTime - startTime);
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        if (remainTime <= 0) {
            func.apply(context, args);
            startTime = Date.now();
        } else {
            timer = setTimeout(function() {
                func.apply(context, args);
            }, remainTime);
        }
    }
}