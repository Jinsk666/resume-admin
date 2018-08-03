import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    stepData: [], // 步骤弹出框 数据
    stepDataClone: [],
    accordionIndex: 0, // 手风琴 展开项的 index
    isMaterial: false,
    farmModule: null,
    processModule: null,
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SWITCH_STEPDATA: (state, data) => {
      state.stepData = data;
    },
    SWITCH_STEPDATA_CLONE: (state, data) => {
      state.stepDataClone = data;
    },
    ACCORDION_INDEX: (state, index) => {
      state.accordionIndex = index;
    },
    IS_MATERIAL: (state, is) => {
      state.isMaterial = is;
    },
    ADD_FARM_MODULE: (state, data) => {
      state.farmModule = data;
    },
    ADD_PROCESS_MODULE: (state, data) => {
      state.processModule = data;
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    }
  }
}

export default app
