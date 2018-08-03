import { login, logout, accountLogin } from '@/api/login'
import { getToken, setToken, removeToken, getName, setName, removeName } from '@/utils/auth'

const user = {
  state: {
	token: getToken(),
	username: getName()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
	},
	SET_NAME: (state, name) => {
		state.username = name
	}
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
		      const data = response.data
          setToken(data.accessToken)
          setName(data.username)
          commit('SET_TOKEN', data.accessToken)
          commit('SET_NAME', data.username)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
	},
	AccountLogin({ commit }, userInfo) {
		const username = userInfo.username.trim()
		return new Promise((resolve, reject) => {
		  accountLogin(username, userInfo.password).then(response => {
        const data = response.data
        setToken(data.accessToken)
        setName(data.username)
        commit('SET_TOKEN', data.accessToken)
        commit('SET_NAME', data.username)
        resolve()
		  }).catch(error => {
			  reject(error)
		  })
		})
	  },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_NAME', '')
          removeToken()
          removeName()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        removeToken()
        removeName()
        resolve()
      })
    }
  }
}

export default user
