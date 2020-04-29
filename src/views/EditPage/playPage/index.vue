<!--演示页面-->
<template>
  <div class="play-page">
    <div class="full-btn" @mouseover="mouseOver" @mouseleave="mouseLeave">
      <div class="return-btn" v-show="isShowReturnBtn" @click="returntoEdit">
        退出
      </div>
    </div>
    <div
      class="full-btn_left"
      @mouseover="goLeftPage(true)"
      @mouseleave="goLeftPage(false)"
      @click="goPrevPPT"
    >
      <div class="left-img" v-show="isShowLeftBtn"></div>
    </div>
    <div
      class="full-btn_right"
      @mouseover="goRightPage(true)"
      @mouseleave="goRightPage(false)"
      @click="goNextPPT"
    >
      <div class="right-img" v-show="isShowRightBtn"></div>
    </div>
    <div class="play-canvas" ref="playCanvas">
      <canvas id="play-canvas"></canvas>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
import { mapState } from "vuex";
export default {
  name: "playPage",
  data() {
    return {
      canvasWidth: 0,
      canvasHeight: 0,
      selectedObj: null, // 选中的对象
      doDrawing: false, // 绘制状态
      drawingObject: null, // 当前绘制对象
      // 鼠标按下的起点
      mouseFrom: {
        x: 0,
        y: 0
      },
      mouseTo: {
        x: 0,
        y: 0
      },
      color: "#000000",
      drawWidth: 2, // 笔触宽度
      canvasObject: null,
      isShowCloseBtn: false,  // 是否显示关闭按钮
      isShowReturnBtn: false,
      isShowLeftBtn: false,
      isShowRightBtn: false,
      currentIndex: 0,
      SCALE_FACTOR: 1.3
    }
  },
  computed: {
    ...mapState(["canvasInfo"])
  },
  methods: {
    /**获取画布的宽度 */
    getPara() {
      // 编辑页画布的高宽
      this.canvasWidth = 1477;
      this.canvasHeight = 745.4;
    },
    /**初始化 */
    initCanvas() {
      this.canvasObj = new fabric.Canvas("play-canvas", {
        isDrawingMode: false, //设置是否可以绘制
        selectable: false, //设置控件是否可以选中拖动
        selection: false, //整个画板是否被选中
        skipTargetFind: false, //整个画板元素不能被选中
        backgroundColor: "#ffffff"
      });
      this.canvasObj.setWidth(this.canvasWidth); //设置画布的宽度
      this.canvasObj.setHeight(this.canvasHeight); //设置画布的高度
      // this.canvasInfo.canvasObject = this.canvasObj;
    },

    /**画布缩放 */
    canvasZoom() {
      console.log("hfjdkshfkjh");
      this.canvasObj.setWidth(this.canvasObj.getWidth() * this.SCALE_FACTOR);
      this.canvasObj.setHeight(this.canvasObj.getHeight() * this.SCALE_FACTOR);
      this.canvasObj.renderAll();
    },

    /** 元素和背景图缩放 */
    zoomObjects(canvasData, currentIndex, infoLength) {
      this.canvasInfo.canvasArrScale = canvasData;
      let canvasDataCopy = [...canvasData];
      for (var m = 0; m < infoLength; m++) {
        let canvasState = canvasDataCopy[currentIndex].item[m].obj;
        let canvasString = JSON.parse(canvasState);
        // 如果元素中含有背景图片
        if ("backgroundImage" in canvasString) {
          this.zoomBgImg(canvasString);
        } else {
          let canvasObjs = canvasString.objects;
          this.zoomObj(canvasObjs);
        }
        this.canvasInfo.canvasArrScale[currentIndex].item[
          infoLength - 1
        ].obj = JSON.stringify(canvasString);
      }
    },

    /**缩放元素的大小 */
    zoomObj(canvasObjs) {
      for (var i in canvasObjs) {
        let scaleX = canvasObjs[i].scaleX;
        let scaleY = canvasObjs[i].scaleY;
        if (scaleX > 1) {
          // 防止二次缩放
          return;
        } else {
          // 缩放元素的位置和大小
          let left = canvasObjs[i].left;
          let top = canvasObjs[i].top;
          let tempScaleX = scaleX * this.SCALE_FACTOR;
          let tempScaleY = scaleY * this.SCALE_FACTOR;
          let tempLeft = left * this.SCALE_FACTOR;
          let tempTop = top * this.SCALE_FACTOR;
          canvasObjs[i].scaleX = tempScaleX;
          canvasObjs[i].scaleY = tempScaleY;
          canvasObjs[i].left = tempLeft;
          canvasObjs[i].top = tempTop;
        }
      }
    },

    /**缩放背景图片 */
    zoomBgImg(canvasString) {
      let canvasbgImage = canvasString.backgroundImage;
      let width = canvasbgImage.width;
      let height = canvasbgImage.height;
      if (width >= 1920) {
        // 防止二次缩放
        return;
      } else {
        let tempWidth = width * this.SCALE_FACTOR;
        let tempHeight = height * this.SCALE_FACTOR;
        canvasbgImage.width = tempWidth;
        canvasbgImage.height = tempHeight;
      }
    },

    /**点击演示时，画布显示第一张缩略图数据 */
    renderPlayCanvas() {
      this.currentIndex = 0;
      console.log(this.canvasInfo.canvasArr);
      let infoLength = this.canvasInfo.canvasArr[this.currentIndex].item.length;
      // 初始化画布参数
      this.getPara();
      this.initCanvas();
      this.canvasZoom();
      this.zoomObjects(
        this.canvasInfo.canvasArr,
        this.currentIndex,
        infoLength
      );
      if (infoLength > 0) {
        // 渲染第一张幻灯片
        this.getCanvasData(this.currentIndex);
      } else {
        this.$utils.tipBox("当前没有幻灯片数据哦！", "error");
      }
    },

    /**获取每一张幻灯片的数据 */
    getCanvasData(currentIndex) {
      let itemLength = this.canvasInfo.canvasArrScale[currentIndex].item.length;
      let currentState = this.canvasInfo.canvasArrScale[currentIndex].item[
        itemLength - 1
      ].obj;
      this.loadCanvas(currentState);
    },

    /** 将数据写入画布 */
    loadCanvas(currentState) {
      this.canvasObj.loadFromJSON(currentState, () => {
        this.canvasObj.renderAll();
      });
    },

    /**加载前一张 PPT */
    goPrevPPT() {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex++;
        this.$utils.tipBox("已经是第一张啦！", "success");
        return;
      } else {
        let infoLength = this.canvasInfo.canvasArr[this.currentIndex].item
          .length;
        this.zoomObjects(
          this.canvasInfo.canvasArr,
          this.currentIndex,
          infoLength
        );
        this.getCanvasData(this.currentIndex);
      }
    },

    /**加载后一张 PPT */
    goNextPPT() {
      this.currentIndex++;
      let canvasLength = this.canvasInfo.canvasArr.length;
      if (this.currentIndex > canvasLength - 1) {
        this.currentIndex--;
        this.$utils.tipBox("已经是最后一张啦！", "success");
        return;
      } else {
        let infoLength = this.canvasInfo.canvasArr[this.currentIndex].item
          .length;
        this.zoomObjects(
          this.canvasInfo.canvasArr,
          this.currentIndex,
          infoLength
        );
        this.getCanvasData(this.currentIndex);
      }
    },

    goRightPage(bool) {
      this.isShowRightBtn = bool;
    },

    goLeftPage(bool) {
      this.isShowLeftBtn = bool;
    },

    mouseOver() {
      this.isShowCloseBtn = true;
      this.isShowReturnBtn = true;
    },

    mouseLeave() {
      this.isShowCloseBtn = false;
      this.isShowReturnBtn = false;
    },
    returntoEdit() {
      this.$emit("returntoEdit");
    }
  }
}
</script>
<style lang="scss" scope>
@import "./style/index.scss";
</style>
