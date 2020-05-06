<!-- 编辑制作幻灯片页面-->
<template>
  <div class="edit-page">
    <div class="edit-header">
      <edit-header
        ref="editHeader"
        @delWork="delWork"
        @playPPT="playPPT"
        @showTagDialog="isShowTags = true"
        :pptName="pptName"
        @returnHome="isShowSaveDialog = true"
      ></edit-header>
    </div>
    <div class="edit-container">
      <edit-sidebar class="edit-sidebar"></edit-sidebar>
      <edit-container class="edit-content"></edit-container>
    </div>

    <confirm-dialog
      v-show="isShowConfirm"
      @closeDialog="closeDialog"
      @sureDel="sureDel"
    ></confirm-dialog>

    <!-- 预览 ppt -->
    <play-page
      ref="playPage"
      v-show="isShowPlayPage"
      @returntoEdit="returntoEdit"
    ></play-page>

    <!-- <save-dialog
      v-show="isShowSaveDialog"
      @returntoHome="returntoHome"
      @saveReturn="saveReturn"
      @closeDialog="closeDialog">
    </save-dialog> -->

    <!-- admin choose tags -->
    <choose-tags v-show="isShowTags" @finishChoose="finishChoose"></choose-tags>
  </div>
</template>

<script>
import { mapState } from "vuex";
import EditHeader from "./edit-header";
import ConfirmDialog from "@/components/confirm-dialog";
import EditSidebar from "./edit-sidebar";
import EditContainer from "./edit-container";
// import SaveDialog from "@/components/save-dialog";
import chooseTags from "@/components/choose-tags";
import playPage from "./playPage/index";
export default {
  name: "editPage",
  components: {
    EditHeader,
    ConfirmDialog,
    EditSidebar,
    EditContainer,
    // SaveDialog,
    playPage,
    chooseTags
  },
  data() {
    return {
      isShowConfirm: false,
      isShowSaveDialog: false,
      pptName: "",
      isShowPlayPage: false,
      isShowTags: false
    };
  },
  computed: {
    ...mapState(["canvasInfo"])
  },
  mounted() {
    this.getName();
  },
  methods: {
    /**获取 pptName */
    getName() {
      this.pptName = this.$route.params.pptName;
    },
    delWork() {
      this.isShowConfirm = true;
    },
    closeDialog() {
      this.isShowConfirm = false;
      this.isShowSaveDialog = false;
    },
    playPPT() {
      this.isShowPlayPage = true;
      this.$refs.playPage.renderPlayCanvas();
    },
    returntoEdit() {
      this.isShowPlayPage = false;
    },
    /**删除幻灯片 */
    sureDel() {
      this.canvasInfo.thumList = [];
      this.canvasInfo.canvasArr = [];
      this.canvasThum = [];
      this.isShowConfirm = false;
      this.$router.push({ name: "newWork" });
    },

    /**不保存直接退出 */
    returntoHome() {
      this.$router.push({ name: "home" });
    },

    /**保存并退出 */
    saveReturn() {
      // 保存操作
      this.$refs.editHeader.savePPT();
      // 退出
      this.$router.push({ name: "home" });
    },

    /**管理员选择标签完成，开始保存模板 */
    finishChoose(pptTags) { 
        this.isShowTags = false;
        this.$refs.editHeader.getSaveInfo(pptTags);
    }
  }
};
</script>
<style lang="scss" scope>
@import "./style/index.scss";
</style>
