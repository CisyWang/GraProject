export default {
  addCanvas(state) {
    state.canvasInfo.countCanvas.push({});
  },

  userStatus(state, user) {
    if (user) {
      console.log(state);
      console.log("fdsfdsfsafd");
      console.log(user);
      
      state.loginInfo.currentUser = user.username;
      state.loginInfo.userId = user.userid;
      state.loginInfo.isLogin = true;
      state.loginInfo.role = user.role;
      console.log(state.loginInfo.currentUser);
      console.log(state.loginInfo.userId);
      
    } else if (user == null) {
      console.log("shuaxin");
      // 登出的时候，清空sessionStrage
      sessionStorage.setItem("username", null);
      sessionStorage.setItem("token", "");
      sessionStorage.setItem("isLogin", false);
      sessionStorage.setItem("role", -1);
      state.loginInfo.currentUser = null;
      state.loginInfo.isLogin = false;
    }
  }
};
