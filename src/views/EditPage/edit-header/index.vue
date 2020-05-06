<!--编辑页面头部 -->
<template>
  <div class="header-page">
    <div class="header-logo"></div>
    <div class="operate-btns">
      <div class="save-prev" title="保存" @click="showTags"></div>
      <div class="return-prev" title="撤销" @click="undoCanvas"></div>
      <div class="clear-all" title="清空" @click="clearCanvas"></div>
      <div class="eraser" title="擦除" @click="removeObj"></div>
    </div>
    <div class="name-word">
      <div class="name">{{ this.pptName }}</div>
      <div class="suffix">.ppt</div>
      <!-- <el-input placeholder="未命名的文档" v-model="defaultInput"></el-input> -->
    </div>
    <div class="func-btns">
      <div class="delete-word common" @click="delWork">删除</div>
      <div class="demonstrate-btn common" @click="playPPT">演示</div>
      <div class="return-home common" @click="returnHome">返回首页</div>
    </div>
  </div>
</template>

<script>
import { savePPT } from "../../../service/ppt";
import { mapState } from "vuex";
import { Loading } from 'element-ui';
export default {
  name: "edit-header",
  props: ["pptName"],
  data() {
    return {
      defaultInput: "",
      undoStep: 0, // 撤销操作
      clearCount: 0,
      clearObj: 0,
      showTagDialog: false,
      loadingInstance:null
    }
  },
  computed: {
    ...mapState(["canvasInfo", "loginInfo"])
  },
  methods: {
    delWork() {
      this.$emit("delWork");
    },
    returnHome() {
      // this.$emit("returnHome");
      this.$router.push({ path: "/" });
    },

    /**是否出现管理员标签 */
    showTags() {
      if (this.loginInfo.role == 0) {
        this.showTagDialog = true;
        this.$emit("showTagDialog", this.showTagDialog);
      } else {
        this.getSaveInfo();
      }
    },

    /**获取保存 canvas 的所有信息 */
    getSaveInfo(pptTags) {
      let saveInfo = {},
        userId = this.loginInfo.userId,
        pptInfo = [],
        pptInfoItem = {};

      pptInfoItem.pptname = this.pptName;
      pptInfoItem.pptData = {};

      pptInfoItem.pptData.canvasThum = this.canvasInfo.canvasThum;
      pptInfoItem.pptData.canvasArr = this.canvasInfo.canvasArr;
      pptInfoItem.pptData.countList = this.canvasInfo.thumList;

      pptInfo.push(pptInfoItem);

      saveInfo.userid = userId;
      saveInfo.pptinfo = pptInfo;
      if (pptTags != null) {
        saveInfo.tags = pptTags;
      }

      let params = saveInfo;
      this.savePPTs(params);
    },

    /**保存幻灯片 */
    savePPTs(params) {
      var _this = this;
      var options = {
        lock: true,
        customClass: "create-isLoading",
        text: "正在保存",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      };
      _this.loadingInstance = Loading.service(options);

      savePPT(params)
        .then(res => {
          console.log("保存成功", res);
          if (res.data.code == "200") {
            _this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
              _this.loadingInstance.close();
            });
            _this.$utils.tipBox(res.data.message, "success");
          } else {
            _this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
              _this.loadingInstance.close();
            });
            _this.$utils.tipBox(res.data.message, "error");
          }
        })
        .catch(err => {
          console.log("error", err);
        })
    },

    /**撤销操作 */
    undoCanvas() {
      console.log("undo");
      this.undoStep++;
      this.$Bus.$emit("undoStep", this.undoStep);
    },

    /**清空画布 */
    clearCanvas() {
      // 清空当前画布内容
      this.clearCount++;
      this.$Bus.$emit("clearCount", this.clearCount);
    },

    /**橡皮擦除 */
    removeObj() {
      this.clearObj++;
      this.$Bus.$emit("clearObj", this.clearObj);
    },

    /**幻灯片演示 */
    playPPT() {
      // this.$router.push({ name: "playPage" });
      this.$emit("playPPT");
    }
  }
};
</script>
<style lang="scss" scope>
@import "./style/index.scss";
</style>
<style lang="scss">
.el-input__inner {
  width: 150px;
  height: 30px;
  line-height: 30px;
  padding: 10px;
}
.create-isLoading {
  .el-loading-text {
    color: #0ab087;
  }
  i {
    color: #0ab087;
  }
}
</style>
