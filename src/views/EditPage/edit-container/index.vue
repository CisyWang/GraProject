<!--编辑页面 ppt 内容页 -->
<template>
  <div class="edit-container">
    <div class="action-bar">
      <div class="action-bar-tools">
        <div
          class="icon noselect"
          v-for="(item, index) in iconList"
          :key="index"
          :title="item.title"
          @click.stop="showDetails(index)"
        >
          <img :src="item.iconUrl" />
        </div>
        <div
          class="action-theme icon set-btn noselect"
          title="主题"
          @click.stop="showDetails(6)"
        >
          主题
        </div>
        <!-- <div
          class="action-fade icon set-btn noselect"
          title="过渡效果"
          @click.stop="showDetails(7)"
        >
          过渡效果
        </div> -->
      </div>
    </div>
    <!-- 文本设置 -->
    <transition name="zoom">
      <text-style v-show="isShowTextBox && isShow"></text-style>
    </transition>

    <!-- 形状 -->
    <transition name="zoom">
      <shape v-show="isShowShape && isShow"></shape>
    </transition>

    <!-- 文本 -->
    <transition name="zoom">
      <edit-text v-show="isShowText && isShow"></edit-text>
    </transition>

    <!-- 填充 -->
    <transition name="zoom">
      <fill v-show="isShowFill && isShow" ref="fillColor"></fill>
    </transition>

    <!-- 描边 -->
    <transition name="zoom">
      <stroke v-show="isShowStroke && isShow" ref=""></stroke>
    </transition>

    <!-- 旋转 -->
    <transition name="zoom">
      <rotate
        v-show="isShowRotate && isShow"
        ref="rotateCanvas"
        @clockwiseRotate="clockwiseRotate"
        @anticlockwiseRotate="anticlockwiseRotate"
        @rotateScaleX="rotateScaleX"
        @rotateScaleY="rotateScaleY"
        @customizeRotate="customizeRotate"
      ></rotate>
    </transition>

    <!-- 主题 -->
    <transition name="zoom">
      <theme v-show="isShowTheme && isShow" ref="fillColor"></theme>
    </transition>

    <!-- canvas 编辑模块 -->
    <edit-canvas
      ref="editCanvas"
      @currentState="getState"
      :imgId="imgId"
    ></edit-canvas>
  </div>
</template>

<script>
import Shape from "./shape";
import EditText from "./edit-text";
import EditCanvas from "./edit-canvas";
import Fill from "./fill";
import Theme from "./theme";
import Rotate from "./rotate";
import Stroke from "./stroke";
import TextStyle from "./text-style";
import { mapState } from "vuex";
export default {
  name: "edit-container",
  components: {
    Shape,
    EditCanvas,
    EditText,
    Fill,
    Theme,
    Rotate,
    Stroke,
    TextStyle
  },
  data() {
    return {
      isShowShape: false,
      isShowText: false,
      isShowFill: false,
      isShowTheme: false,
      isShowRotate: false,
      isShowStroke: false,
      isShowTextBox: false,
      iconList: [
        {
          title: "文本",
          iconUrl: require("@/assets/editPage/text.png")
        },
        {
          title: "形状",
          iconUrl: require("@/assets/editPage/shape.png")
        },
        {
          title: "文字",
          iconUrl: require("@/assets/editPage/write.png")
        },
        {
          title: "填充",
          iconUrl: require("@/assets/editPage/fill.png")
        },
        {
          title: "描边",
          iconUrl: require("@/assets/editPage/stroke.png")
        },
        {
          title: "旋转",
          iconUrl: require("@/assets/editPage/rotate.png")
        }
      ],
      currentState: "", //当前画布状态
      TIndex: 0,
      isShow: false, // 所有下拉框的显示
      imgId: "",
      undoStep: 0,  // 撤销操作
    };
  },
  mounted() {
    this.initPage();
    this.$Bus.$on("imgId", e => {
      this.imgId = e;
      console.log("imgId", this.imgId);
    });
    this.$Bus.$on("undoStep", e => {
      this.undoStep = e;
    });
  },
  watch: {
    imgId: {
      deep: true,
      handler: function() {
        this.initRightCanvas(this.imgId, this.canvasInfo.canvasArr);
      }
    },
    undoStep: {
      handler: function() {
        this.undoCanvas();
      }
    },
  },
  computed: {
    ...mapState(["canvasInfo"])
  },
  methods: {
    /**点击其他区域收起下拉框 */
    initPage() {
      let _this = this;
      document.addEventListener("click", () => {
        _this.isShow = false;
      });
    },
    initPara() {
      this.isShowShape = false;
      this.isShowText = false;
      this.isShowFill = false;
      this.isShowTheme = false;
      this.isShowRotate = false;
      this.isShowStroke = false;
      this.isShowTextBox = false;
    },
    /**下拉框显示 */
    showDetails(id) {
      this.initPara();
      switch (id) {
        case 0: // 文本
          this.isShowText = !this.isShowText;
          break;
        case 1: // 形状
          this.isShowShape = !this.isShowShape;
          break;
        case 2: // 文字设置
          this.isShowTextBox = !this.isShowTextBox;
          break;
        case 3: // 填充
          this.isShowFill = !this.isShowFill;
          break;
        case 4: // 描边
          this.isShowStroke = !this.isShowStroke;
          break;
        case 5: //旋转
          this.isShowRotate = !this.isShowRotate;
          break;
        case 6: //主题
          this.isShowTheme = !this.isShowTheme;
          break;
      }
      this.isShow = !this.isShow;
    },

    /**获取编辑状态 */
    getState(data) {
      this.currentState = data;
      this.$Bus.$emit("currentState", this.currentState);
    },

    /**清空画布 */
    clearCanvas() {
      this.$refs.editCanvas.clearCanvas();
    },

    /**顺时针旋转 */
    clockwiseRotate(clockwiseAngle) {
      this.$refs.editCanvas.rotateObj(clockwiseAngle);
    },

    /**逆时针旋转 */
    anticlockwiseRotate(anticlockwiseAngle) {
      this.$refs.editCanvas.rotateObj(anticlockwiseAngle);
    },

    rotateScaleX() {
      this.$refs.editCanvas.scaleXObj();
    },

    rotateScaleY() {
      this.$refs.editCanvas.scaleYObj();
    },

    customizeRotate(angelNum) {
      this.$refs.editCanvas.customizeRotate(angelNum);
    },

    /**清空并重新渲染右侧画布 */
    initRightCanvas(id, lastCurrent) {
      this.$refs.editCanvas.clearCanvas();
      // 渲染右侧画布
      this.$refs.editCanvas.getCanvas(id, lastCurrent);
    },

    /**调用 edit-canvas 中撤退方法 */
    undoCanvas() {
      this.$refs.editCanvas.canvasUndo(this.imgId);
    }
  }
};
</script>
<style lang="scss" scope>
@import "./style/index.scss";
</style>
