import {
    login,
    logout
} from '@/api'
import {
    getToken,
    setToken,
    removeToken
} from '@/utils/auth'

const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: ''
    },

    getters: {
        token: ({
            token
        }) => token,
        name: ({
            name
        }) => name,
        avatar: ({
            avatar
        }) => avatar
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        }
    },

    actions: {
        // 登录
        Login({
            commit
        }, userInfo) {
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                login(username, userInfo.password)
                    .then(response => {
                        const data = response.data
                        // 更新cookie Token
                        setToken(data.token)
                        commit('SET_TOKEN', data.token)
                        commit('SET_NAME', data.name)
                        commit('SET_AVATAR', data.avatar)
                        resolve()
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },

        // 登出
        LogOut({
            state
        }) {
            return new Promise((resolve, reject) => {
                logout(state.token)
                    .then(() => {
                        removeToken()
                        resolve()
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        }
    }
}

export default user