export const currentUser = state => {
  return state.loginInfo.currentUser;
};
export const isLogin = state => {
  console.log("get");
  return state.loginInfo.isLogin;
}