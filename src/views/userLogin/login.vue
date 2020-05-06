<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-container_left">
        <!--<img src="" alt="leftImg">-->
      </div>
      <div class="login-container_right">
        <div class="login-form">
          <div class="login-form-header">
            <span class="noselect">登录</span>
          </div>
          <div class="login-form-content">
            <input
              class="user-account"
              v-model="telephone"
              :class="{ active: accountFocus == true }"
              type="text"
              placeholder="您的手机号"
              @click="inputUsername()"
            />
            <input
              class="user-password"
              v-model="password"
              :class="{ active: passwdFocus == true }"
              type="password"
              placeholder="您的密码"
              @click="inputPasswd()"
            />
            <div class="verify-code">
              <input
                class="code-input"
                type="text"
                v-model="loginCode"
                placeholder="您的验证码"
                @click="inputCode"
                :class="{ active: codeFocus }"
              />
              <img class="verify-img" :src="verifyImg" @click="getVercode" />
            </div>

            <!-- 角色选择 -->
            <div class="choose-role">
              <el-radio class="admin-role" v-model="role" label="0">管理员</el-radio>
              <el-radio class="user-role" v-model="role" label="1">用户</el-radio>
            </div>
            <div class="user-login" @click="submitWork">
              <span>{{ loginText }}</span>
            </div>
          </div>
          <div class="login-form-footer">
            <div class="user-register-text noselect">
              没有账号？请
              <a class="user-register" @click="goToRegister"
                >&nbsp;&nbsp;注册</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LoginWork } from "../../service/login";

import { mapState } from "vuex";
export default {
  name: "login",
  data() {
    return {
      loginText: "登录",
      telephone: "",
      password: "",
      accountFocus: false,
      passwdFocus: false,
      codeFocus: false,
      loginCode: "", // 登录验证码
      resTelephone: "",
      verifyImg: "", // 验证码图片
      uuid: "",
      role: "0"
    };
  },
  computed: {
    ...mapState(["loginInfo"]),
  },
  created() {
    this.getVercode();
    this.$Bus.$on("resTelephone", e => {
      this.resTelephone = e;
    });
  },
  methods: {
    // 跳转到注册页面
    goToRegister() {
      this.$emit("goToRegister");
    },
    initInput() {
      this.accountFocus = false;
      this.passwdFocus = false;
      this.codeFocus = false;
    },
    inputUsername() {
      this.initInput();
      this.accountFocus = true;
    },
    inputPasswd() {
      this.initInput();
      this.passwdFocus = true;
    },
    inputCode() {
      this.initInput();
      this.codeFocus = true;
    },

    /**获取登录验证码 */
    getVercode() {
      var uuid = this.$utils.uuid();
      var baseURL = "http://www.insozhao.cn/api/sys_user/getVercode";
      this.verifyImg = `${baseURL}?uuid=${uuid}`;
      this.uuid = uuid;
    },

    // 用户登录
    submitWork() {
      if (this.telephone == "" || this.password == "") {
        this.$utils.tipBox("请将信息填写完整哦！", "error");
        return;
      } else if (
        this.telephone.indexOf(" ") >= 0 ||
        this.password.indexOf(" ") >= 0
      ) {
        this.$utils.tipBox("信息不能是空格哦！", "error");
        return;
      } else if (this.loginCode == "") {
        this.$utils.tipBox("验证码不能为空！","error");
        return;
      } else {
        this.loginWork();
      }
    },

    loginWork() {
      let _this = this;
      // 获取登录用户的 ip 地址
      // let ip = localStorage.getItem("ip");
      let logintime = this.$utils.getCurTime();

      this.loginInfo.role = this.role;
      console.log(this.loginInfo.role);

      LoginWork({
        logintime: logintime,
        username: this.telephone,
        password: this.password,
        vercode: this.loginCode,
        role: this.role,
        uuid: this.uuid
      })
        .then(res => {
          if (res.data.code !== "200") {
            _this.$utils.tipBox(res.data.message, "error");
            _this.getVercode();
          } else {
            _this.$utils.tipBox("登录成功！", "success");
            _this.loginInfo.userId = this.telephone;
            _this.loginInfo.isLogin = true;
            // _this.loginInfo.nickname = res.data.data.userinfo.username;
            _this.loginInfo.firstLogin = res.data.data.firstLogin;
            sessionStorage.setItem("token", res.data.data.token);
            sessionStorage.setItem("username", res.data.data.userinfo.username);
            sessionStorage.setItem("userid", res.data.data.userinfo.userid);
            sessionStorage.setItem("isLogin", true);
            sessionStorage.setItem("role", this.role);
            _this.$store.dispatch("setUser", {
              username: res.data.data.userinfo.username,
              userid: res.data.data.userinfo.userid,
              role: this.role
            });
            setTimeout(() => {
              _this.$router.push({ name: "home" });
            }, 1000);
          }
        })
        .catch(res => {
          console.log("fail", res);
          _this.$utils.tipBox("登录失败，请检查用户名和密码！", "error");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
// @import "./style/index.scss";
.login-page {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgb(247, 247, 247);
  box-sizing: border-box;
}

.login-container {
  position: absolute;
  width: 807px;
  height: 454px;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);

  .login-container_left {
    float: left;
    width: 468px;
    height: 454px;
    background: url("~assets/editPage/logintheme.png");
  }

  .login-container_right {
    position: relative;
    float: right;
    width: 338px;
    height: 454px;
    padding: 0 35px;
    background-color: #ffffff;

    .login-form-header {
      text-align: center;
      padding: 35px 0;

      span {
        color: #666666;
        font-size: 24px;
      }
    }

    .user-account,
    .user-password,
    .verify-code {
      width: 100%;
      height: 40px;
      font-size: 12px;
      margin-bottom: 10px;
      padding-left: 10px;
      color: #333333;
      background-color: rgb(244, 244, 244);
      outline: none;
      border: none;
    }
    .verify-code {
      padding-left: 0px;
    }
    .choose-role {
      position: relative;
      width: 100%;
      height: 40px;
      // border: 1px solid #f4f4f4;
      .admin-role,
      .user-role {
        position: absolute;
        left: 0px;
        line-height: 40px;
      }
      .user-role {
        left: 100px;
      }
    }

    .code-input {
      float: left;
      width: 138px;
      height: 40px;
      color: #2b2b2b;
      padding-left: 10px;
      font-size: 12px;
      background-color: #f4f4f4;
      border: none;
      outline: none;
    }
    .verify-img {
      width: 130px;
      height: 40px;
      color: #ffffff;
      background-color: #D7D7D7;
      border: none;
      outline: none;
      cursor: pointer;
    }

    .user-login {
      width: 100%;
      height: 38px;
      margin-top: 10px;
      background-color: #0ab087;
      text-align: center;
      font-size: 16px;
      cursor: pointer;

      span {
        color: #ffffff;
        line-height: 38px;
      }
    }

    .login-form-footer {
      position: absolute;
      width: 100%;
      height: 60px;
      left: 0;
      bottom: 0;
      border-top: 1px solid rgb(235, 236, 241);

      .user-register-text {
        font-size: 12px;
        color: rgb(118, 118, 119);
        text-align: center;
        line-height: 60px;

        .user-register {
          color: #0ab087;
          cursor: pointer;
        }
      }
    }
  }

  input[placeholder] {
    color: rgb(201, 201, 201);
  }

  .user-account.active,
  .user-password.active,
  .code-input.active {
    background-color: #fdfdfd;
    color: #333333;
    border: 1px solid rgb(244, 244, 244);
  }
}
</style>
<style>
.el-radio__input.is-checked+.el-radio__label {
  color: #0ab087;
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: #0ab087;
  background-color: #0ab087;
}
</style>
