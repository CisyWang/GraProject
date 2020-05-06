<template>
  <el-container class="home-container">
    <choose-tags
      v-show="isShowTags && loginInfo.role == 1 && loginInfo.firstLogin"
      @finishChoose="finishChoose"
    ></choose-tags>
    <el-header>
      <div class="container-header" :class="{ start: isScroll }">
        <!-- <div class="logo-pic">logo</div> -->
        <div v-if="!loginInfo.isLogin">
          <div class="header-login" @click="loginWork">
            <span class="login-text">登录</span>
          </div>
          <div class="header-register" @click="registerWork">
            <span class="register-text">注册</span>
          </div>
        </div>
        <div class="header-avator" @click="loginOut">
          <img :src="defaultAvator" />
        </div>
        <div
          v-show="isLogin && isShowLoginOut"
          class="login-out"
          @click="loginoutConfirm"
        >
          退出登录
        </div>
        <div class="header-username">
          {{ this.$store.state.loginInfo.currentUser }}
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="index-panel">
        <div class="panel-img-left"></div>
        <div class="panel-content">
          <div class="panel-intro">
            <span class="intro-text"
              >强大的在线制作幻灯片工具，轻松创造优秀作品</span
            >
            <span class="intro-tips noselect"
              >在线制作幻灯片，各种模板个性推荐，作品轻松搞定！</span
            >
            <div class="more-feature noselect">
              <a href="#feature">更多特色</a>
            </div>
          </div>
          <div class="start-work">
            <div class="start-btn" @click="startNewWork">
              <span>立即开始</span>
              <i class="start-icon"></i>
            </div>
          </div>
          <div class="swiper-img">
            <div class="item">
              <img :src="dataList[currentIndex]">
            </div>
            <div class="page" v-if="this.dataList.length > 1">
              <ul class="noselect" @mouseenter="clearInv" @mouseleave="runInv">
                <li @click="gotoPage(prevIndex)">&lt;</li>
                <li
                  v-for="(item, index) in dataList"
                  :key="index"
                  @click="gotoPage(index)"
                  :class="{ current: currentIndex == index }"
                >
                  {{ index + 1 }}
                </li>
                <li @click="gotoPage(nextIndex)">&gt;</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="panel-img-right"></div>
      </div>
    </el-main>
    <el-footer>
      <div class="recommend-module">
        <div class="module-title" id="feature">
          2020 最新幻灯片模板推荐
        </div>
        <div class="module-content scroll">
          <!-- 模板推荐内容 -->
          <div
            class="module-item"
            v-for="(item, index) in imgArr"
            :key="index"
            @mouseenter="mouseenter(index)"
            @mouseleave="mouseleave"
          >
            <img class="module-img" :src="imgArr[index]" />
            <div class="module-tools" v-show="currentModule == index">
              <div class="module-btns">
                <!-- <div class="play-btn" @click="playModule">预览</div> -->
                <div class="use-btn" @click="useModule(index)">使用看看</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container-footer">
        <div class="qr-code"></div>
        <div class="foot-text noselect">
          <span class="call-us">联系我们</span>
          <span class="address">地址: 安徽省滁州市南谯区丰乐大道1528号</span>
        </div>
      </div>

      <!-- 演示 -->
      <play-page v-show="isShowPlay" ref="playPage"></play-page>
    </el-footer>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
import chooseTags from "@/components/choose-tags";
import playPage from "@/views/EditPage/playPage/index";
import { getModules } from "@/service/ppt";
export default {
  name: "home",
  inject: ["reload"],
  components: {
    chooseTags,
    playPage
  },
  data() {
    return {
      dataList: [
        require("../../assets/editPage/swiper-edit.png"),
        require("../../assets/editPage/swiper-repeat.png"),
        require("../../assets/editPage/swiper-new.png")
      ],
      currentIndex: 0, //默认显示图片
      timer: null, //定时器
      isScroll: false,
      defaultAvator: require("../../assets/editPage/defaultAvator.png"),
      isShowTags: true,
      isShowBtns: false,
      currentModule: -1,
      isShowPlay: false,
      isShowLoginOut: false,
      imgArr: [], // 模板封面
      moduleData:"" // 模板数据
    }
  },
  computed: {
    ...mapState(["loginInfo", "canvasInfo"]),
    //上一张
    prevIndex() {
      if (this.currentIndex == 0) {
        return this.dataList.length - 1;
      } else {
        return this.currentIndex - 1;
      }
    },
    //下一张
    nextIndex() {
      if (this.currentIndex == this.dataList.length - 1) {
        return 0;
      } else {
        return this.currentIndex + 1;
      }
    },
    isLogin() {
      if (
        sessionStorage.getItem("username") &&
        sessionStorage.getItem("token")
      ) {
        var username = sessionStorage.getItem("username");
        var userid = sessionStorage.getItem("userid");
        var role = sessionStorage.getItem("role");
        this.$store.commit("userStatus", { username, userid, role });
      } else {
        this.$store.commit("userStatus", null);
      }
      return this.$store.getters.isLogin;
    }
  },
  watch: {
    isShowTags: {
      handler: function() {
        this.stopScroll();
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.runInv();
    this.stopScroll();
    this.getModules();
  },
  methods: {
    /**标签弹窗出现去除页面滚动条 */
    stopScroll() {
      var mo = function(e) {
        e.preventDefault();
      };
      if (
        this.isShowTags &&
        this.loginInfo.role == 1 &&
        this.loginInfo.firstLogin
      ) {
        document.body.style.overflow = "hidden";
        document.addEventListener("touchmove", mo, false); //禁止页面滑动
      } else {
        document.body.style.overflow = ""; //出现滚动条
        document.removeEventListener("touchmove", mo, false);
      }
    },
    finishChoose() {
      this.isShowTags = false;
      if (this.loginInfo.firstLogin == true) {
        this.getModules();
      }
    },
    // 点击登录按钮，跳转到登录页面
    loginWork() {
      this.$router.push({ name: "loginAndResigter", params: { type: 0 } });
    },
    registerWork() {
      this.$router.push({ name: "loginAndResigter", params: { type: 1 } });
    },
    editWork() {
      this.$router.push({ name: "editPage" });
    },
    /**跳转到新建幻灯片页面 */
    startNewWork() {
      if (this.loginInfo.isLogin) {
        this.$router.push({ name: "newWork" });
      } else {
        this.$router.push({ name: "loginAndResigter" });
      }
    },

    gotoPage(index) {
      this.currentIndex = index;
    },

    /**定时器*/
    runInv() {
      this.timer = setInterval(() => {
        this.gotoPage(this.nextIndex);
      }, 2000);
    },

    clearInv() {
      clearInterval(this.timer);
    },

    /**鼠标滚动 */
    handleScroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (scrollTop > 0) {
        this.isScroll = true;
      } else {
        this.isScroll = false;
      }
    },

    /**显示模板按钮 */
    mouseenter(idx) {
      this.currentModule = idx;
    },
    mouseleave() {
      this.currentModule = -1;
    },

    loginOut() {
      this.isShowLoginOut = !this.isShowLoginOut;
    },

    loginoutConfirm() {
      this.$store.commit("userStatus", null);
      this.reload();
    },

    /**获取 PPT 模板 */
    getModules() {
      getModules({ userid: this.loginInfo.userId })
        .then(res => {
          console.log("success");
          this.moduleData = res;
          this.getPostImg();
        })
        .catch( err => {
          console.log("fail");
          console.log(err);
        });
    },

    /**处理模板数据，获取模板封面图片 */
    getPostImg() {
      let data = this.moduleData.data;
      let imgAll = [];
      data.forEach(item => {
        imgAll.push(JSON.parse(item.data).canvasThum);
        console.log(imgAll);
      });
      imgAll.forEach(item => {
        this.imgArr.push(item[0].img);
      });
    },

    /**预览模板 */
    playModule() {
      this.isShowPlay = true;
      this.$refs.playPage.renderPlayCanvas();
    },

    /**使用模板 */
    useModule(idx) {
      let data = this.moduleData.data;
      let moduleArr = [];
      let moduleThum = [];
      let moduleSide = [];
      let pptname;
      this.loginInfo.isEditMode = true;
      data.forEach(item => {
        moduleArr.push(JSON.parse(item.data).canvasArr);
        moduleThum.push(JSON.parse(item.data).canvasThum);
        moduleSide.push(JSON.parse(item.data).countList);
      });
      this.canvasInfo.canvasArr = moduleArr[idx];
      this.canvasInfo.canvasThum = moduleThum[idx];
      this.canvasInfo.thumList = moduleSide[idx];
      pptname = data[idx].name;
      this.$router.push({
        name: "editPage",
        params: { pptName: pptname }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./style/index.scss";
</style>
