<!--注册页面 -->
<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-container_left">
        <!--<img src="" alt="leftImg">-->
      </div>
      <div class="register-container_right">
        <div class="register-form">
          <div class="register-form-header">
            <span>注册</span>
          </div>
          <div class="register-form-content">
            <div class="phone-filed">
              <span>+86</span>
              <input
                type="text"
                class="phone-input"
                v-model="registerInfo.telephone"
                :class="{ active: phoneFocus == true }"
                @click="getFocus(1)"
                placeholder="请输入您的手机号"
              />
            </div>
            <div class="code-filed">
              <input
                type="text"
                class="code-input"
                v-model="registerInfo.verifycode"
                :class="{ active: codeFocus == true }"
                placeholder="验证码"
                @click="getFocus(2)"
              />
              <button class="code-btn" @click="getCode()">
                获取短信验证码
              </button>
            </div>
            <input
              type="password"
              class="inputPasswd"
              v-model="registerInfo.password"
              placeholder="密码"
              :class="{ active: passwdFocus == true }"
              @click="getFocus(3)"
            />
            <input
              type="text"
              class="inputName"
              v-model="registerInfo.nickname"
              placeholder="昵称"
              :class="{ active: nameFocus == true }"
              @click="getFocus(4)"
            />
            <div class="useer-register">
              <div class="register-btn" @click="getRegisterInfo">注册</div>
            </div>
          </div>
          <div class="register-form-footer">
            <div class="user-register-text noselect">
              注册成功？请
              <a class="user-register" @click.prevent="goToLogin"
                >&nbsp;&nbsp;登录</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SendVerCode, RegisterWork } from "../../service/login";
import axios from "axios";
import qs from "qs";
export default {
  name: "register",
  data() {
    return {
      // 用户注册信息
      registerInfo: {
        telephone: "",
        nickname: "",
        password: "",
        verifycode: ""
      },
      phoneFocus: false,
      nameFocus: false,
      codeFocus: false,
      passwdFocus: false
    };
  },
  methods: {
    getFocus(id) {
      this.phoneFocus = false;
      this.codeFocus = false;
      this.passwdFocus = false;
      this.nameFocus = false;
      switch (id) {
        case 1: {
          this.phoneFocus = true;
          break;
        }
        case 2: {
          this.codeFocus = true;
          break;
        }
        case 3: {
          this.passwdFocus = true;
          break;
        }
        case 4: {
          this.nameFocus = true;
          break;
        }
      }
    },
    goToLogin() {
      // this.$router.push({ name: "login" });
      this.$emit("goToLogin");
    },

    // 获取短信验证码
    getCode() {
      let _this = this;
      let telephone = this.registerInfo.telephone;
      SendVerCode({
        telephone: telephone
      })
        .then(res => {
          window.console.log("success!", res);
          _this.$utils.tipBox("验证码发送成功，请注意查收！", "success");
        })
        .catch(res => {
          window.console.log("获取验证码失败！", res);
        });
    },

    /**获取注册信息 */
    getRegisterInfo() {
      // let ip = localStorage.getItem("ip");
      let nickname = this.registerInfo.nickname;
      let password = this.registerInfo.password;
      let vertifycode = this.registerInfo.verifycode;
      let telephone = this.registerInfo.telephone;
      let registertime = this.$utils.getCurTime();
      // let timestamp = this.$utils.timeStamp();
      this.$Bus.$emit("resTelephone", telephone);
      // this.loginInfo.nickname = nickname;

      if (
        nickname == "" ||
        vertifycode == "" ||
        telephone == "" ||
        password == ""
      ) {
        this.$utils.tipBox("将信息填写完整才能注册哦！", "error");
        return;
      } else if (
        nickname.indexOf(" ") >= 0 ||
        vertifycode.indexOf(" ") >= 0 ||
        telephone.indexOf(" ") >= 0 ||
        password.indexOf(" ") >= 0
      ) {
        this.$utils.tipBox("信息不能全是空格哦！", "error");
        return;
      } else {
        // let params = {
        //   registerTime: registertime,
        //   userid: telephone,
        //   username: nickname,
        //   password: password,
        //   messageCode: vertifycode
        // };
        // this.registerWork(qs.stringify(params));
        axios
        .post(
          "http://www.insozhao.cn/api/sys_user/register",
            qs.stringify({
              registerTime: registertime,
              userid: telephone,
              username: nickname,
              password: password,
              messageCode: vertifycode
            })
            )
          .then(
            result => {
              console.log(result);
              this.$utils.tipBox("注册成功！", "success");
            },
            error => {
              console.log(error);
          });
        }
    },

    // 注册
    registerWork(params) {
      let _this = this;
      RegisterWork(params)
        .then(res => {
          window.console.log("success!", res);
          _this.$utils.tipBox("注册成功！", "success");
        })
        .catch(res => {
          window.console.log("error", res);
          _this.$utils.tipBox("注册失败！", "success");
        });
    }
  }
};
</script>
<style lang="scss" scope>
// @import "./style/index.scss";
.register-page {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgb(247, 247, 247);
  box-sizing: border-box;
}

.register-container {
  position: absolute;
  width: 808px;
  height: 454px;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);

  .register-container_left {
    float: left;
    width: 468px;
    height: 454px;
    background: url("~assets/editPage/registertheme.png");
  }

  .register-container_right {
    position: relative;
    float: right;
    width: 340px;
    height: 454px;
    padding: 0 35px;
    background-color: #ffffff;

    .register-form-header {
      text-align: center;
      padding: 30px 0;

      span {
        color: #666666;
        font-size: 24px;
      }
    }

    .phone-filed {
      width: 270px;
      height: 40px;
      margin-bottom: 10px;
      background-color: #f4f4f4;

      span {
        display: inline-block;
        width: 60px;
        height: 20px;
        color: #2b2b2b;
        font-size: 12px;
        text-align: center;
        border-right: 1px solid #c8c8c8;
        vertical-align: middle;
        line-height: 20px;
      }

      .phone-input {
        width: 210px;
        height: 40px;
        padding-left: 10px;
        color: #2b2b2b;
        background-color: #f4f4f4;
        border: none;
        outline: none;
      }
    }

    .code-filed {
      width: 270px;
      height: 40px;
      margin-bottom: 10px;

      .code-input {
        display: inline-block;
        width: 140px;
        height: 40px;
        padding-left: 10px;
        color: #2b2b2b;
        background-color: #f4f4f4;
        border: none;
        outline: none;
      }

      .code-btn {
        width: 130px;
        height: 40px;
        color: #ffffff;
        background-color: #D7D7D7;
        border: none;
        outline: none;
        cursor: pointer;
      }
    }

    .useer-register {
      width: 100%;
      height: 40px;
      background-color: #0ab087;
      cursor: pointer;

      .register-btn {
        font-size: 16px;
        color: #ffffff;
        line-height: 40px;
        text-align: center;
      }
    }

    .inputPasswd,
    .inputName {
      width: 270px;
      height: 40px;
      padding-left: 10px;
      margin-bottom: 10px;
      background-color: #f4f4f4;
      color: #2b2b2b;
      outline: none;
      border: none;
    }

    .inputPasswd {
      margin-bottom: 10px;
    }
  }

  .register-form-footer {
    position: absolute;
    width: 100%;
    height: 60px;
    left: 0;
    bottom: 0;
    border-top: 1px solid rgb(235, 236, 241);

    .user-register-text {
      font-size: 12px;
      text-align: center;
      line-height: 60px;
      cursor: pointer;

      .user-register {
        color: #0ab087;
      }
    }
  }
}

input[placeholder] {
  color: rgb(201, 201, 201);
}

.phone-input.active,
.code-input.active,
.inputPasswd.active,
.inputName.active {
  background-color: #FDFDFD !important;
  color: #333333;
}
</style>
