<!--canvas 编辑页面 -->
<template>
  <div class="edit-box">
    <div class="edit-box-content" ref="editCanvas">
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
import { mapState } from "vuex";
export default {
  name: "edit-canvas",
  props: ["imgId"],
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
      drawType: "", // 选中的要绘制的图形
      color: "#000000",
      drawWidth: 2, // 笔触宽度
      canvasObject: null,
      moveCount: 0, // 绘制移动计数器
      selectedColor: "",
      isFill: false, // 是否进行填充
      bgImgUrl: "", // 背景图片地址
      themeColor: "", // 主题背景色
      currentState: "", // 画布状态
      svg: "",
      canvasImg: "", // 画布导出成图片
      clearMode: false, // 是否清空画布
      lastAngel: 0, // 图层的角度

      //撤销回退相关操作状态配置表
      config: {
        canvasData: [], // 每张画布每步操作的数据（重复）
        undoCanvasState: "", // 撤销操作要渲染的画布数据
        undoCanvasData: [], // 一张画布的每步操作数据
        currentStateIndex: -1
      },
      isInitialStatus: false, // 是否为初始状态
      titleType: "",
      textbox: null,
      strokeType: "",
      strokeColor: "#000000",
      thickness: "", // 描边粗细
      cIdArr: [], // canvas 画布数据id
      stateIdxArr: [],
      textSize: "", // 文本字号
      textColor: "", // 文字颜色
      hightLight: "",
      textFamily: "微软雅黑", // 文字类型
      textStyleArr: {},
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isThrough: false,
      isShadow: false,
      lineHeight: 1,
      lineSpace: 2,
      alignLeft: false,
      alignRight: false,
      centerAlign: false,
      justifyAlign: false,
      imgType: 0, // 0 北极图片 1 插入图片
      clearCount: 0,
      clearObj: 0
    };
  },
  mounted() {
    this.getPara();
    this.initCanvas();
    this.$Bus.$on("type", e => {
      this.drawType = e;
    });
    this.$Bus.$on("selectedColor", e => {
      this.selectedColor = e;
    });
    this.$Bus.$on("isFill", e => {
      this.isFill = e;
    });
    this.$Bus.$on("bgImgUrl", e => {
      this.bgImgUrl = e;
      console.log("on", this.bgImgUrl);
    });
    this.$Bus.$on("themeColor", e => {
      this.themeColor = e;
    });
    this.$Bus.$on("titleType", e => {
      this.titleType = e;
    });
    this.$Bus.$on("strokeType", e => {
      this.strokeType = e;
    });
    this.$Bus.$on("strokeColor", e => {
      this.strokeColor = e;
    });
    this.$Bus.$on("strokeColor", e => {
      this.strokeColor = e;
    });
    this.$Bus.$on("thickness", e => {
      this.thickness = e;
    });
    this.$Bus.$on("textSize", e => {
      this.textSize = e;
    });
    this.$Bus.$on("textFamily", e => {
      this.textFamily = e;
    });
    this.$Bus.$on("textColor", e => {
      this.textColor = e;
    });
    this.$Bus.$on("hightLight", e => {
      this.hightLight = e;
    });
    this.$Bus.$on("isBold", e => {
      this.isBold = e;
    });
    this.$Bus.$on("isItalic", e => {
      this.isItalic = e;
    });
    this.$Bus.$on("isUnderline", e => {
      this.isUnderline = e;
    });
    this.$Bus.$on("isThrough", e => {
      this.isThrough = e;
    });
    this.$Bus.$on("isShadow", e => {
      this.isShadow = e;
    });
    this.$Bus.$on("lineHeight", e => {
      this.lineHeight = e;
    });
    this.$Bus.$on("lineSpace", e => {
      this.lineSpace = e;
    });
    this.$Bus.$on("alignLeft", e => {
      this.alignLeft = e;
    });
    this.$Bus.$on("alignRight", e => {
      this.alignRight = e;
    });
    this.$Bus.$on("centerAlign", e => {
      this.centerAlign = e;
    });
    this.$Bus.$on("justifyAlign", e => {
      this.justifyAlign = e;
    });
    this.$Bus.$on("imgType", e => {
      this.imgType = e;
    });
    this.$Bus.$on("clearCount", e => {
      this.clearCount = e;
    });
    this.$Bus.$on("clearObj", e => {
      this.clearObj = e;
    });
  },
  computed: {
    ...mapState(["canvasInfo"])
  },
  watch: {
    selectedColor: {
      handler: function() {
        this.fillColor(this.selectedColor);
      }
    },
    bgImgUrl: {
      handler: function() {
        this.importBgImg(this.bgImgUrl, this.imgType);
      }
    },
    themeColor: {
      handler: function() {
        this.importBgColor(this.themeColor);
      }
    },
    strokeType: {
      handler: function() {
        this.modifyStrokeType(this.strokeType);
      }
    },
    strokeColor: {
      handler: function() {
        this.modifyStrokeColor(this.strokeColor);
      }
    },
    thickness: {
      handler: function() {
        this.modifythickness(this.thickness);
      }
    },
    textSize: {
      handler: function() {
        this.modifyTextSize(this.textSize);
      }
    },
    textColor: {
      handler: function() {
        this.modifyTextColor(this.textColor);
      }
    },
    hightLight: {
      handler: function() {
        this.modifyhightLight(this.hightLight);
      }
    },
    textFamily: {
      handler: function() {
        this.modifyTextFamily(this.textFamily);
      }
    },
    isBold: {
      handler: function() {
        this.modifyTextBold(this.isBold);
      }
    },
    isItalic: {
      handler: function() {
        this.modifyTextItalic(this.isItalic);
      }
    },
    isUnderline: {
      handler: function() {
        this.modifyTextUnderline(this.isUnderline);
      }
    },
    isThrough: {
      handler: function() {
        this.modifyTextThough(this.isThrough);
      }
    },
    isShadow: {
      handler: function() {
        this.modifyTextShadow(this.isShadow);
      }
    },
    lineHeight: {
      handler: function() {
        this.modifyLineHeight(this.lineHeight);
      }
    },
    lineSpace: {
      handler: function() {
        this.modifyLineSpace(this.lineSpace);
      }
    },
    alignLeft: {
      handler: function() {
        this.modifyAlignLeft(this.alignLeft);
      }
    },
    alignRight: {
      handler: function() {
        this.modifyAlignRight(this.alignRight);
      }
    },
    centerAlign: {
      handler: function() {
        this.modifyAlignCenter(this.centerAlign);
      }
    },
    justifyAlign: {
      handler: function() {
        this.modifyAlignJustify(this.justifyAlign);
      }
    },
    clearCount: {
      handler: function() {
        this.clearCanvasData();
      }
    },
    clearObj: {
      handler: function() {
        this.removeObj();
      }
    }
  },
  methods: {
    /**获取画布的宽度 */
    getPara() {
      this.canvasWidth = this.$refs.editCanvas.offsetWidth;
      this.canvasHeight = this.$refs.editCanvas.offsetHeight;
    },
    resetObj() {

    },
    // 初始化
    initCanvas() {
      this.canvasObj = new fabric.Canvas("canvas", {
        isDrawingMode: false, //设置是否可以绘制
        selectable: true, //设置控件是否可以选中拖动
        selection: true, //整个画板是否被选中
        skipTargetFind: false, //整个画板元素不能被选中
        backgroundColor: "#ffffff"
      });
      this.canvasObj.setWidth(this.canvasWidth); //设置画布的宽度
      this.canvasObj.setHeight(this.canvasHeight); //设置画布的高度

      this.canvasObj.freeDrawingBrush.color = this.color; //设置自由绘颜色
      this.canvasObj.freeDrawingBrush.width = this.drawWidth;

      this.canvasObj.on({
        "mouse:down": o => {
          console.log("mousedown", this.drawType);
          //鼠标在画布上按下事件(起点)
          this.mouseFrom.x = o.pointer.x; //鼠标按下的X的起点
          this.mouseFrom.y = o.pointer.y; //鼠标按下的y的起点
          this.doDrawing = true; //绘制设为true
        },
        "mouse:up": o => {
          //鼠标抬起的事件(终点)
          this.mouseTo.x = o.pointer.x;
          this.mouseTo.y = o.pointer.y;
          this.drawingObject = null;
          this.moveCount = 1;
          console.log("次数", this.moveCount);

          this.drawType = "";
          this.canvasObj.selectable = true;
          this.canvasObj.selection = true;

          this.doDrawing = false; //停止绘制
          this.saveCanvasState(); // 画布状态记录
          this.canvastoImg(); // 画布转换成图片
        },
        "mouse:move": o => {
          //鼠标在移动中的事件
          this.offsetX = o.pointer.x.toFixed(0);
          this.offsetY = o.pointer.y.toFixed(0);
          if (this.moveCount % 2 && !this.doDrawing) {
            return;
          }
          this.moveCount++;
          this.mouseTo.x = o.pointer.x;
          this.mouseTo.y = o.pointer.y;
          this.drawing(this.drawType);
        },
        "object:move": e => {
          console.log("move");
          e.target.opacity = 0.5; //你绘画在画布上对象，移动它们的时候，让它们的透明度变成0.5
        },
        // 初次选中图层
        "selection:created": e => {
          this.selectedObj = e.target;
          this.canvasInfo.selectedCanvasObj = this.selectedObj;
        },
        // 图层选择变化
        "selection:updated": e => {
          this.selectedObj = e.target;
          console.log(this.selectedObj);
          this.canvasInfo.selectedCanvasObj = this.selectedObj;
        },
        "object:modified": e => {
          // e.target.opacity = 1;
          console.log("修改++++++++", e.target);
        }
      });
      // this.canvasInfo.canvasObject = this.canvasObj;
    },

    /**画布元素绘制 */
    drawing(type) {
      console.log("type", type);
      var left = this.mouseFrom.x,
        top = this.mouseFrom.y;
      var width = this.mouseTo.x - left;
      var radius =
        Math.sqrt(
          (this.mouseTo.x - left) * (this.mouseTo.x - left) +
            (this.mouseTo.y - top) * (this.mouseTo.y - top)
        ) / 2;
      if (this.drawingObject) {
        this.canvasObj.remove(this.drawingObject);
      }
      if (this.textbox) {
        //退出文本编辑状态
        this.textbox.exitEditing();
        this.textbox = null;
      }

      switch (type) {
        // 直线
        case "line": {
          this.resetObj();
          this.canvasObject = new fabric.Line(
            [
              this.mouseFrom.x,
              this.mouseFrom.y,
              this.mouseTo.x,
              this.mouseTo.y
            ],
            {
              stroke: this.color,
              strokeWidth: this.drawWidth,
              hasControls: true, // 是否开启图层的控件
            }
          );
          break;
        }
        // 箭头
        case "row-line": {
          this.resetObj();
          this.canvasObject = new fabric.Path(
            this.drawArrow(
              this.mouseFrom.x,
              this.mouseFrom.y,
              this.mouseTo.x,
              this.mouseTo.y,
              15,
              15
            ),
            {
              stroke: this.color,
              fill: "rgba(255,255,255,0)",
              strokeWidth: this.drawWidth
            }
          );
          break;
        }
        // 虚线
        case "dotted": {
          this.resetObj();
          this.canvasObject = new fabric.Line(
            [
              this.mouseFrom.x,
              this.mouseFrom.y,
              this.mouseTo.x,
              this.mouseTo.y
            ],
            {
              strokeDashArray: [3, 3],
              stroke: this.color,
              strokeWidth: this.drawWidth
            }
          );
          break;
        }
        // 矩形
        case "rectangle": {
          this.resetObj();
          this.canvasObject = new fabric.Rect({
            left: left,
            top: top,
            width: this.mouseTo.x - this.mouseFrom.x,
            height: this.mouseTo.y - this.mouseFrom.y,
            stroke: this.color,
            strokeWidth: this.drawWidth,
            fill: "rgba(255,255,255,0)"
          });
          break;
        }
        // 等边三角形
        case "equilateral": {
          this.resetObj();
          let height = this.mouseTo.y - this.mouseFrom.y;
          this.canvasObject = new fabric.Triangle({
            top: top,
            left: left,
            width: Math.sqrt(Math.pow(height, 2) + Math.pow(height / 2.0, 2)),
            height: height,
            stroke: this.color,
            strokeWidth: this.drawWidth,
            fill: "rgba(255,255,255,0)"
          });
          break;
        }
        // 正圆
        case "circle": {
          this.resetObj();
          this.canvasObject = new fabric.Circle({
            left: left,
            top: top,
            stroke: this.color,
            fill: "rgba(255, 255, 255, 0)",
            radius: radius,
            strokeWidth: this.drawWidth
          });
          break;
        }
        case "ellipse": //椭圆
          this.resetObj();
          this.canvasObject = new fabric.Ellipse({
            left: left,
            top: top,
            stroke: this.color,
            fill: "rgba(255, 255, 255, 0)",
            originX: "center",
            originY: "center",
            rx: Math.abs(left - this.mouseTo.x),
            ry: Math.abs(top - this.mouseTo.y),
            strokeWidth: this.drawWidth
          });
          break;
        case 0: // 大标题
          this.textbox = new fabric.Textbox("", {
            left: left,
            top: top,
            width: width,
            fontSize: 32,
            fontWeight: "bold",
            borderColor: "#2c2c2c",
            fill: this.color,
            hasControls: true,
            breakWords: true
          });
          this.addTitle();
          break;
        case 1: // 小标题
          this.textbox = new fabric.Textbox("", {
            left: left,
            top: top,
            width: width,
            fontSize: 24,
            fontWeight: "bold",
            borderColor: "#2c2c2c",
            fill: this.color,
            hasControls: true,
            breakWords: true
          });
          this.addTitle();
          break;
        case 2: // 正文
          this.textbox = new fabric.Textbox("", {
            left: left,
            top: top,
            width: width,
            fontSize: 24,
            letterSpace: 8,
            borderColor: "#2c2c2c",
            fill: this.color,
            hasControls: true,
            breakWords: true
          });
          this.addTitle();
          break;
        case 3: // 正文(小)
          this.textbox = new fabric.Textbox("", {
            left: left,
            top: top,
            width: width,
            fontSize: 16,
            borderColor: "#2c2c2c",
            fill: this.color,
            hasControls: true,
            breakWords: true
          });
          this.addTitle();
          break;
        case 4: // 说明
          this.textbox = new fabric.Textbox("", {
            left: left,
            top: top,
            width: width,
            fontSize: 16,
            borderColor: "#2c2c2c",
            fill: "#0ab087",
            hasControls: true
          });
          this.addTitle();
          break;
        case 5: // 说明(背景)
          this.textbox = new fabric.Textbox("", {
            left: left,
            top: top,
            width: width,
            fontSize: 16,
            textBackgroundColor: "#0ab087",
            borderColor: "#2c2c2c",
            fill: "#ffffff",
            hasControls: true
          });
          this.addTitle();
          break;
        case 6: // 引文
          this.textbox = new fabric.Textbox("", {
            left: left,
            top: top,
            width: width,
            fontSize: 14,
            borderColor: "#2c2c2c",
            fill: "#707b8e",
            hasControls: true
          });
          this.addTitle();
          break;
        case 7: // 注释
          this.textbox = new fabric.Textbox("", {
            left: left,
            top: top,
            width: width,
            fontSize: 14,
            borderColor: "#2c2c2c",
            fill: "#707b8e",
            hasControls: true
          });
          this.addTitle();
          break;
        case 8: // 大标题（背景）
          this.textbox = new fabric.Textbox("", {
            left: left,
            top: top,
            width: width,
            fontSize: 32,
            fontWeight: "bold",
            textBackgroundColor: "#3c4252",
            borderColor: "#2c2c2c",
            fill: "#ffffff",
            hasControls: true
          });
          this.addTitle();
          break;
        case 9: // 小标题（背景）
          this.textbox = new fabric.Textbox("", {
            left: left,
            top: top,
            width: width,
            fontSize: 24,
            fontWeight: "bold",
            textBackgroundColor: "#3c4252",
            borderColor: "#2c2c2c",
            fill: "#ffffff",
            hasControls: true
          });
          this.addTitle();
          break;
        case 10: // 正文（背景）
          this.textbox = new fabric.Textbox("", {
            left: left,
            top: top,
            width: width,
            fontSize: 24,
            textBackgroundColor: "#3c4252",
            borderColor: "#2c2c2c",
            fill: "#ffffff",
            hasControls: true
          });
          this.addTitle();
          break;
        case 11: // 大标题（背景）
          this.textbox = new fabric.Textbox("", {
            left: left,
            top: top,
            width: width,
            fontSize: 32,
            fontWeight: "bold",
            textBackgroundColor: "#9DA0AB",
            borderColor: "#2c2c2c",
            fill: "#ffffff",
            hasControls: true
          });
          this.addTitle();
          break;
        case 12: // 小标题（背景）
          this.textbox = new fabric.Textbox("", {
            left: left,
            top: top,
            width: width,
            fontSize: 24,
            fontWeight: "bold",
            textBackgroundColor: "#9DA0AB",
            borderColor: "#2c2c2c",
            fill: "#ffffff",
            hasControls: true
          });
          this.addTitle();
          break;
        case 13: // 正文（背景）
          this.textbox = new fabric.Textbox("", {
            left: left,
            top: top,
            width: width,
            fontSize: 24,
            textBackgroundColor: "#9DA0AB",
            borderColor: "#2c2c2c",
            fill: "#ffffff",
            hasControls: true
          });
          this.addTitle();
          break;
        default:
          this.canvasObject = "";
          break;
      }
      if (this.canvasObject) {
        this.canvasObj.add(this.canvasObject); //.setActiveObject(canvasObject)
        this.drawingObject = this.canvasObject;
      }
    },

    /**画布添加标题 */
    addTitle() {
      this.canvasObj.add(this.textbox);
      this.textbox.enterEditing();
      this.textbox.hiddenTextarea.focus();
      this.canvasObject = "";
    },

    /**绘制箭头方法 */
    drawArrow(fromX, fromY, toX, toY, theta, headlen) {
      theta = typeof theta != "undefined" ? theta : 30;
      headlen = typeof theta != "undefined" ? headlen : 10;
      // 计算各角度和对应的P2,P3坐标
      var angle = (Math.atan2(fromY - toY, fromX - toX) * 180) / Math.PI,
        angle1 = ((angle + theta) * Math.PI) / 180,
        angle2 = ((angle - theta) * Math.PI) / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);
      var arrowX = fromX - topX,
        arrowY = fromY - topY;
      var path = " M " + fromX + " " + fromY;
      path += " L " + toX + " " + toY;
      arrowX = toX + topX;
      arrowY = toY + topY;
      path += " M " + arrowX + " " + arrowY;
      path += " L " + toX + " " + toY;
      arrowX = toX + botX;
      arrowY = toY + botY;
      path += " L " + arrowX + " " + arrowY;
      return path;
    },

    /**旋转对象*/
    rotateObj(rotateAngle) {
      const currAngle = this.selectedObj.angle; // 当前图层的角度
      this.lastAngel =
        currAngle === 360 ? rotateAngle : currAngle + rotateAngle;
      this.selectedObj.rotate(this.lastAngel);
      this.canvasObj.renderAll();
      this.$Bus.$emit("lastAngel", this.lastAngel);
    },

    /**修改描边类型 */
    modifyStrokeType(strokeType) {
      this.selectedObj.set("stroke", this.strokeColor);
      switch (strokeType) {
        case 1: {
          // 无描边
          this.selectedObj.set("stroke", "");
          break;
        }
        case 2: {
          // 直线
          this.selectedObj.set("strokeDashArray", "");
          break;
        }
        case 3: {
          // 密集虚线
          this.selectedObj.set("strokeDashArray", [6, 4]);
          break;
        }
        case 4: {
          // 分散虚线
          this.selectedObj.set("strokeDashArray", [6, 8]);
          break;
        }
      }
      this.canvasObj.renderAll();
    },

    /**修改描边颜色 */
    modifyStrokeColor(strokeColor) {
      this.selectedObj.set("stroke", strokeColor);
      this.canvasObj.renderAll();
    },

    /**修改描边粗细 */
    modifythickness(thickness) {
      this.selectedObj.set("strokeWidth", thickness);
      this.canvasObj.renderAll();
    },

    /**翻转对象 水平镜像*/
    scaleXObj() {
      this.selectedObj.set({
        scaleX: -this.selectedObj.scaleX
      });
      this.canvasObj.renderAll();
    },

    /**翻转对象 垂直镜像 */
    scaleYObj() {
      this.selectedObj.set({
        scaleY: -this.selectedObj.scaleY
      });
      this.canvasObj.renderAll();
    },

    /**自定义旋转 */
    customizeRotate(angelNum) {
      console.log("angelNum", angelNum);
      this.selectedObj.rotate(angelNum);
      this.canvasObj.renderAll();
    },
    /**填充颜色 */
    fillColor(color) {
      this.selectedObj.set("fill", color);
      this.selectedObj.set("stroke", this.strokeColor);
      console.log(this.selectedObj);
      this.canvasObj.renderAll();
    },

    /**修改文本的字体大小 */
    modifyTextSize(textSize) {
      this.selectedObj.set("fontSize", textSize);
      this.canvasObj.renderAll();
    },

    /**修改字体颜色 */
    modifyTextColor(textColor) {
      this.selectedObj.set("fill", textColor);
      this.canvasObj.renderAll();
    },

    /**高亮 */
    modifyhightLight(highLight) {
      this.selectedObj.set("textBackgroundColor", highLight);
      this.canvasObj.renderAll();
    },

    /**修改文本字体类型 */
    modifyTextFamily(textFamily) {
      this.selectedObj.set("fontFamily", textFamily);
      this.canvasObj.renderAll();
    },

    /**文本加粗 */
    modifyTextBold(isBold) {
      if (isBold == true) {
        this.selectedObj.fontWeight = "bold";
      } else {
        this.selectedObj.fontWeight = "normal";
      }
      this.canvasObj.renderAll();
    },
    /**文本斜体 */
    modifyTextItalic(isItalic) {
      if (isItalic == true) {
        this.selectedObj.fontStyle = "italic";
      } else {
        this.selectedObj.fontStyle = "normal";
      }
      this.canvasObj.renderAll();
    },
    /**文本下划线 */
    modifyTextUnderline(isUnderline) {
      this.selectedObj.set("underline", isUnderline);
      this.canvasObj.renderAll();
    },

    /**文本中划线 */
    modifyTextThough(isThrough) {
      this.selectedObj.set("linethrough", isThrough);
      this.canvasObj.renderAll();
    },
    /**文本阴影 */
    modifyTextShadow(isShadow) {
      if (isShadow) {
        console.log("shadow");
        this.selectedObj.set("shadow", "rgba(0,0,0,0.3) 3px 3px 2px");
      } else {
        this.selectedObj.set("shadow", "");
      }
      this.canvasObj.renderAll();
    },
    /**文本行高 */
    modifyLineHeight(lineHeight) {
      // this.selectedObj.set("lineHeight", lineHeight);
      this.selectedObj.set("charSpacing", lineHeight);
      console.log(this.selectedObj);
      this.canvasObj.renderAll();
    },
    /**文本间距 */
    modifyLineSpace(lineSpace) {
      this.selectedObj.set("letterSpacing", lineSpace);
      this.canvasObj.renderAll();
    },
    /**文本对齐 */
    modifyAlignLeft(alignLeft) {
       console.log("youduiqi");
      if (alignLeft) {
        this.selectedObj.set("textAlign", "left");
      }
      this.canvasObj.renderAll();
    },
    modifyAlignRight(alignRight) {
      if (alignRight) {
        this.selectedObj.set("textAlign", "right");
      } else {
        this.selectedObj.set("textAlign", "left");
      }
      this.canvasObj.renderAll();
    },
    modifyAlignCenter(centerAlign) {
      if (centerAlign) {
        this.selectedObj.set("textAlign", "center");
      } else {
        this.selectedObj.set("textAlign", "left");
      }
      this.canvasObj.renderAll();
    },
    modifyAlignJustify(justifyAlign) {
      if (justifyAlign) {
        this.selectedObj.set("textAlign", "justify");
      } else {
        this.selectedObj.set("textAlign", "left");
      }
      this.canvasObj.renderAll();
    },

    /**画布图片背景 */
    importBgImg(imgUrl, imgType) {
      console.log("设置画布背景图", imgType);
      var _this = this;
      fabric.Image.fromURL(imgUrl, img => {
        if (imgType == 0) {
          img.set({
            // 通过scale来设置图片大小，这里设置和画布一样大
            scaleX: this.canvasWidth / img.width,
            scaleY: this.canvasHeight / img.height
          });
          // 设置背景
          this.canvasObj.setBackgroundImage(
            img,
            this.canvasObj.renderAll.bind(this.canvasObj)
          );
          this.canvasObj.renderAll();
        } else {
          img.scale(0.5); //图片缩小一半
          _this.canvasObj.add(img);
        }
      });
    },

    /**画布纯色背景 */
    importBgColor(color) {
      this.canvasObj.set("backgroundColor", color);
      this.canvasObj.renderAll();
    },

    /**画布状态记录 暂且鼠标抬起
      保存每张画布的每步操作
      [{id:****,item:[{obj},{}]}] */
    saveCanvasState() {
      this.currentState = JSON.stringify(this.canvasObj.toJSON());
      let state = {},
        curState = {};
      if (this.canvasInfo.canvasArr.length > 0) {
        // canvasArr 中存过相同 id 的画布
        this.canvasInfo.canvasArr.forEach(item => {
          if (item.id == this.imgId) {
            curState.obj = this.currentState;
            item.item.push(curState);
          }
        });
        if (this.stateIdxArr.indexOf(this.imgId) == -1) {
          state.id = this.imgId;
          state.item = [];
          curState.obj = this.currentState;
          state.item.push(curState);
          this.canvasInfo.canvasArr.push(state);
        }
      } else {
        // 如果 canvasArr 为空
        state.id = this.imgId;
        state.item = [];
        curState.obj = this.currentState;
        state.item.push(curState);
        this.canvasInfo.canvasArr.push(state);
      }

      this.canvasInfo.canvasArr.forEach(item => {
        this.stateIdxArr.push(item.id);
      });
      console.log("canvasArr", this.canvasInfo.canvasArr);
    },

    /**渲染画布状态 */
    getCanvas(id, lastCurrent) {
      console.log("lastCurrent", lastCurrent);
      var _this = this;
      var canvasCurrent = "";
      // 获取该 id 的画布元素
      if (lastCurrent.length > 0) {
        // 遍历数组，如果item.cId  等于画布 id，则渲染
        for (var i = 0; i < lastCurrent.length; i++) {
          if (lastCurrent[i].id == id) {
            canvasCurrent = lastCurrent[i].item;
          }
        }
        if (canvasCurrent) {
          // 开始渲染
          this.canvasObj.loadFromJSON(
            canvasCurrent[canvasCurrent.length - 1].obj,
            () => {
              _this.canvasObj.renderAll();
          });
        }
      }
    },

    /**画布撤销操作 */
    canvasUndo(imgId) {
      console.log("撤销");
      this.undoCanvasData = [];
      if (this.canvasInfo.canvasArr.length > 0) {
        // 遍历canvasData
        for (var i = 0; i < this.canvasInfo.canvasArr.length; i++) {
          if (this.canvasInfo.canvasArr[i].id == imgId) {
            this.undoCanvasData = this.canvasInfo.canvasArr[i].item;
            this.undoCanvasData.splice(this.undoCanvasData.length - 1, 1);
          }
        }
        if (this.undoCanvasData.length >= 1) {
          var lastCurrent = this.undoCanvasData[this.undoCanvasData.length - 1];
          // 开始渲染
          this.canvasObj.loadFromJSON(lastCurrent.obj, () => {
            this.canvasObj.renderAll();
          });
          this.getCanvas(this.imgId, this.canvasInfo.canvasArr);
        } else {
          // this.clearCanvas();
          this.clearCanvasData();
        }
      } else {
        this.$utils.tipBox("画布已经是最新状态，不能再进行撤销了！", "error");
      }
      this.undoStatus = true;
      this.canvastoImg();
    },

    /**画布导出成图片 */
    canvastoImg() {
      this.canvasImg = this.canvasObj.toDataURL({
        format: "png"
      });
      this.$Bus.$emit("canvasImg", this.canvasImg);
    },

    /**清空画布 */
    clearCanvasData() {
      if (!this.imgId) {
        console.log("请选择要清空的画布！");
      } else {
        // 清除画布
        this.canvasObj.clear();
        this.canvasObj.renderAll();
        console.log(this.canvasObj);
        // 根据 id 在 canvasArr 中删除数据
        console.log("清空", this.imgId);
        for (var i = 0; i < this.canvasInfo.canvasArr.length; i++) {
          if (this.canvasInfo.canvasArr[i].id == this.imgId) {
            this.canvasInfo.canvasArr.splice(i, 1);
          }
        }
      }
      this.canvastoImg();
    },

    /**点击缩略图清空画布 */
    clearCanvas() {
      this.canvasObj.clear();
    },

    /**移除单个元素 */
    removeObj() {
      console.log("移除元素", this.canvasObj.getActiveObject());
      this.canvasObj.remove(this.canvasObj.getActiveObject());
      this.canvasObj.renderAll();
    }
  }
};
</script>
<style lang="scss" scope>
#canvas {
  background-color: #ffffff;
}
.edit-box {
  width: 100%;
  height: calc(100% - 40px);
  padding: 25px 50px;
}
.edit-box-content {
  width: 100%;
  height: 100%;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
  z-index: 9;
}
</style>
