<!--主题 -->
<template>
  <div class="theme-box" @click.stop>
    <el-card class="theme-card">
      <input
        type="file"
        ref="importImg"
        style="display:none"
        @change="getImgUrl"
      />
      <div class="img-theme" @click="chooseImg(0)">图片背景</div>
      <div class="add-img" @click="chooseImg(1)">插入图片</div>
      <div class="color-theme">
        <span>颜色主题</span>
        <div class="color-picker">
          <el-color-picker
            v-model="defaultColor"
            @change="changeColor"
          ></el-color-picker>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgUrl: "",
      defaultColor: "#000000",
      imgType: 0
    };
  },
  methods: {
    chooseImg(type) {
      if (type == "0") {
        this.imgType = 0;
      } else {
        this.imgType = 1;
      }
      this.$refs.importImg.click();
    },
    /**获取图片的路径 */
    getImgUrl() {
      console.log("图片路径");
      var file = this.$refs.importImg.files[0];
      var _this = this;
      console.log("file", file);
      if (window.FileReader) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        //监听文件读取结束后事件
        reader.onloadend = function(e) {
          //e.target.result 图片路径地址
          _this.$Bus.$emit("bgImgUrl", e.target.result);
          _this.$Bus.$emit("imgType", _this.imgType);
        };
      }
    },
    /**选择主题颜色 */
    changeColor() {
      this.$Bus.$emit("themeColor", this.defaultColor);
    }
  }
};
</script>
<style lang="scss" scope>
.theme-box {
  position: absolute;
  left: 630px;
  z-index: 999;
}
.theme-card {
  width: 120px;
  height: 150px;
}
.img-theme,
.add-img {
  width: 158px;
  height: 30px;
  font-size: 12px;
  color: #707b8e;
  text-align: left;
  line-height: 30px;
  cursor: pointer;
}
.img-theme {
  background: url("~assets/editPage/picture.png") no-repeat 60px 5px;
  &:hover {
    background: url("~assets/editPage/picture_h.png") no-repeat 60px 5px;
  }
}
.add-img {
  background: url("~assets/editPage/add-img.png") no-repeat 60px 5px;
  &:hover {
    background: url("~assets/editPage/add-img_h.png") no-repeat 60px 5px;
  }
}
.color-theme {
  width: 158px;
  height: 40px;
  span {
    float: left;
    font-size: 12px;
    color: #707b8e;
    line-height: 40px;
  }
}
</style>
<style lang="scss">
.color-picker {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-top: 9px;
  margin-left: -63px;
  .el-color-picker {
    height: 20px;
    .el-color-picker__trigger {
      width: 20px;
      height: 20px;
      padding: 0px;
    }
  }
}
</style>
