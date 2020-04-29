<!--用户选择 tags 页面 -->
<template>
 <div class="choose-tags">
   <div class="choose-tags-container">
      <div class="tags-header">
        <span class="nickname">小王</span>
        <span>，欢迎您的登录</span>
      </div>
      <div class="tags-content">
        <p class="tags-intro" v-show="this.loginInfo.role == 1">为了让我们更加了解您，请选择您感兴趣的标签：</p>
        <p class="tags-intro" v-show="this.loginInfo.role == 0">请为您要保存的模板选择标签：</p>
        <div class="tags-set">
          <div class="all-tags-content">
            <p>全部标签：</p>
            <div class="all-tags">
              <div
                class="tag noselect"
                v-for="(item, index) in allTags"
                :class="{active: isAdd.indexOf(index) != -1}"
                :key="index"
                @click="addOrRemoveTag(item.id, index)"
              >
                {{ item.tag }}
              </div>
              <div class="tag empty"></div>
              <div class="tag empty"></div>
              <div class="tag empty"></div>
              <div class="tag empty"></div>
              <div class="tag empty"></div>
            </div>
          </div>
          <div class="my-tags-content">
            <p>我选择的标签：</p>
            <div class="my-tags">
              <div class="tag tag-color noselect" v-for="(item, id) in myTags" :key="id">
                {{ item.tag }}
              </div>
              <div class="tag empty"></div>
              <div class="tag empty"></div>
              <div class="tag empty"></div>
              <div class="tag empty"></div>
              <div class="tag empty"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="tags-footer">
        <div
          class="finish-btn"
          :class="{ select: this.myTags.length > 0 }"
          @click="finishChoose"
        >
          完成
        </div>
      </div>
   </div>
 </div>
</template>

<script>
import { mapState } from "vuex";
 
export default {
  computed: {
    ...mapState(["loginInfo"])
  },
  data() {
    return {
      isSelected: false,
      allTags: [
        { id: 0, tag: "配色" },
        { id: 1, tag: "插图" },
        { id: 2, tag: "简洁" },
        { id: 3, tag: "小清新" },
        { id: 4, tag: "中国风" },
        { id: 5, tag: "公开演讲" },
        { id: 6, tag: "年终总结" },
        { id: 7, tag: "简历竞聘" },
        { id: 8, tag: "节假节日" },
        { id: 9, tag: "毕业答辩" },
        { id: 10, tag: "创意" },
        { id: 11, tag: "其他" },
        { id: 12, tag: "公开演讲" },
        { id: 13, tag: "年终总结" },
        { id: 14, tag: "简历竞聘" },
        { id: 15, tag: "节假节日" },
        { id: 16, tag: "毕业答辩" },
        { id: 17, tag: "创意" },
        { id: 18, tag: "其他" },
        { id: 19, tag: "公开演讲" },
        { id: 20, tag: "年终总结" },
        { id: 21, tag: "简历竞聘" },
        { id: 22, tag: "节假节日" },
        { id: 23, tag: "毕业答辩" },
        { id: 24, tag: "创意" },
        { id: 25, tag: "其他" },
      ],
      myTags: [],
      isAdd:[]
    }
  },
  methods: {
    /**完成标签选择 */
    finishChoose() {
      this.$emit("finishChoose");
    },

    /**判断添加或者移除标签 */
    addOrRemoveTag(id, idx) {
      if (this.myTags.length > 0) {
        // 获取所有 id
        var idArr = [];
        this.myTags.forEach(item => {
          idArr.push(item.id);
        });
        if (idArr.indexOf(id) != -1) this.removeTag(id);
        else this.addTag(id);
      } else {
        this.addTag(id);
      }

      let indexItem = this.isAdd.indexOf(idx);
      if (indexItem == -1) this.isAdd.push(idx);
      else {
        for (var i = 0; i < this.isAdd.length; i++) {
          if (this.isAdd[i] == idx) {
            this.isAdd.splice(i, 1);
          }
        }
      }
    },

    /**添加 tag */
    addTag(id) {
      this.allTags.forEach(item => {
        if (item.id == id) {
          this.myTags.push(item);
        }
      });
    },

    /**移除 tag */
    removeTag(id) {
      for (var i = 0; i < this.myTags.length; i++) {
        if (this.myTags[i].id == id) {
          this.myTags.splice(i, 1);
        }
      }
    },
  }
}
</script>
<style lang="scss" scope>
.choose-tags {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0,0,0,.2);
  z-index: 99;
}
.tag {
  width: 100px;
  height: 40px;
  border: 1px solid #cccccc;
  margin-bottom: 10px;
  color: #666666;
  line-height: 40px;
  border-radius: 50px;
  cursor: pointer;
}
.choose-tags-container {
  // display: flex;
  // flex-direction: column;
  position: fixed;
  width: 800px;
  height: 600px;
  left: 50%;
  top: 45%;
  background-color: #ffffff;
  transform: translate(-50%, -50%);
  border-radius: 4px;
  .tags-header {
    width: 100%;
    height: 60px;
    padding: 0 20px;
    font-size: 16px;
    text-align: left;
    border-bottom: 1px solid #cccccc;
    span {
      color: #666666;
      line-height: 60px;
    }
    .nickname {
      font-size: 20px;
      color: #0ab087;
      font-weight: 400;
    }
  }
  .tags-content {
    // flex: 1;
    position: absolute;
    top: 60px;
    bottom: 80px;
    padding: 10px 100px 0px 100px;
    .tags-intro {
      text-align: left;
      color: #0ab087;
    }
    .tags-set {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: calc(100% - 21px);
      padding-top: 10px;
      .all-tags-content {
        display: flex;
        width: 100%;
        height: 50%;
        flex-direction: column;
        border: 1px solid #ffffff;
        p {
          height: 20px;
          font-size: 16px;
          text-align: left;
          margin-bottom: 10px;
        }
        .all-tags {
          display: flex;
          flex: 1;
          justify-content: space-between;
          flex-wrap: wrap;
          overflow: auto;
        }
        .active {
          color: #67c23a;
          background-color: #f0f9eb;
        }
      }
      .my-tags-content {
        display: flex;
        width: 100%;
        flex-direction: column;
        // flex: 1;
        height: 50%;
        border: 1px solid #ffffff;
        p {
          height: 20px;
          font-size: 16px;
          text-align: left;
          margin-bottom: 10px;
          margin-top: 5px;
        }
        .my-tags {
          display: flex;
          flex: 1;
          justify-content: space-between;
          flex-wrap: wrap;
          overflow-y: auto;
          .tag-color {
            color: #67c23a;
            background-color: #f0f9eb;
          }
        }
      }
    }
  }
  .tags-footer {
    position: fixed;
    width: 100%;
    height: 80px;
    bottom: 0px;
    .finish-btn {
      width: 120px;
      height: 44px;
      margin: 0 auto;
      margin-top: 18px;
      color: #ffffff;
      font-size: 16px;
      line-height: 44px;
      background-color: #cccccc;
      border-radius: 4px;
      cursor: pointer;
      pointer-events: none;
    }
    .select {
      background-color: #0ab087;
      pointer-events: auto;
    }
  }
}
</style>