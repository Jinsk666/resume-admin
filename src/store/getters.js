const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  stepData: state => state.app.stepData,
  stepDataClone: state => state.app.stepDataClone,
  accordionIndex: state => state.app.accordionIndex
}
export default getters
