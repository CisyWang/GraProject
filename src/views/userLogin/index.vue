<!--登录和注册页面-->
<template>
  <div class="user-page">
    <Login v-show="isShowLogin" @goToRegister="goToRegister"></Login>
    <Register v-show="isShowRegister" @goToLogin="goToLogin"></Register>
  </div>
</template>

<script>
import Login from "./login";
import Register from "./register";
export default {
  name: "loginAndRegister",
  components: {
    Login,
    Register
  },
  data() {
    return {
      isShowLogin: false, // 显示登录页面
      isShowRegister: false // 显示注册页面
    }
  },
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {
      if (this.$route.params.type == 0) {
        this.isShowLogin = true;
      } else {
        this.isShowRegister = true;
      }
    },
    goToRegister() {
      this.isShowRegister = true;
      this.isShowLogin = false;
    },
    goToLogin() {
      this.isShowRegister = false;
      this.isShowLogin = true;
    },
  }
}
</script>
<style lang="scss" scope>
.user-page {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
}
</style>