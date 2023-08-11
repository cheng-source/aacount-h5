import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pxtorem from 'postcss-pxtorem';
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    css: {
        postcss: {
            plugins: [pxtorem({
                rootValue: 37.5,
                propList: ['*'], // 匹配所有属性
                selectorBlackList: ['.norem'] // 过滤掉.norem-开头的class，不进行rem转换
            })]
        }
    },
    server: {
        proxy: {
            '/api': {
                // 当遇到 /api 路径时，将其转换成 target 的值
                target: 'http://localhost:7002/api/',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '') // 将 /api 重写为空
            }
        }
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            'utils': path.resolve(__dirname, 'src/utils')
        }
    }

})