<!--新建幻灯片页面 -->
<template>
  <div class="new-page-wrap">
    <div class="new-work-page">
      <div class="new-header">
        <div class="header-text noselect">
          {{ this.loginInfo.currentUser }}
          <span v-show="this.loginInfo.role == 1">的幻灯片</span>
          <span v-show="this.loginInfo.role == 0">的模板</span>
        </div>
        <div class="return-btn" @click="returntoHome"></div>
      </div>
      <div class="pptList scroll">
        <el-table
          :data="tableData"
          style="width: 100%"
          v-show="tableData.length > 0"
        >
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column prop="name" label="我的幻灯片" width="740">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.row)"
                type="text"
                size="small"
              >
                移除
              </el-button>
              <el-button type="text" size="small" @click="editppt(scope.$index)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <!-- 缺省图 -->
        <div class="no-resource" v-show="tableData.length == 0 && !isLoading">
          <span class="noselect">暂无幻灯片</span>
        </div>

        <!-- 加载项 -->
        <div class="loading-img" v-show="isLoading"></div>
      </div>
      <div class="new-footer">
        <div class="new-work-btn" @click="showDialog">
          <span v-show="this.loginInfo.role == 1">新建幻灯片</span>
          <span v-show="this.loginInfo.role == 0">新建模板</span>
        </div>
      </div>
    </div>

    <!-- 新建弹窗 -->
    <newwork-dialog
      v-show="isShowDialog"
      @closeDialog="closeDialog"
      @sureAdd="sureAdd"
    ></newwork-dialog>
  </div>
</template>

<script>
import NewworkDialog from "@/components/newwork-dialog";
import { getAllPPTs, getPPTbyName,deletePPTInfo } from "../../service/ppt";
import { mapState } from "vuex";
import qs from "qs";
import axios from "axios";
export default {
  name: "newWork",
  components: {
    NewworkDialog
  },
  data() {
    return {
      isShowDialog: false, // 显示新建弹窗
      defaultName: "", // ppt名称
      tableData: [], // 所有幻灯片名称
      pptNameArr: [],
      isLoading: true
    };
  },
  computed: {
    ...mapState(["loginInfo", "getInfo", "canvasInfo"])
  },
  mounted() {
    this.getAllPPTs();
  },
  methods: {
    /**获取用户所有的幻灯片 */
    getAllPPTs() {
      var _this = this;
      this.pptNameArr = [];
      getAllPPTs({
        userid: this.loginInfo.userId
      })
        .then(res => {
          for (var item in res.data) {
            this.pptNameArr.push(res.data[item]);
          }
          _this.getTableData();
          _this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },

    /**将 pptName 写进 tableData */
    getTableData() {
      this.tableData = [];
      this.pptNameArr.forEach(item => {
        let data = {};
        data.name = item.name;
        data.id = item.id
        this.tableData.push(data);
      });
      console.log("tableData",this.tableData)
      
    },

    /**打开幻灯片进入编辑页面 */
    editppt(pptIdx) {
      var _this = this;
      var pptname = this.tableData[pptIdx].name;
      this.loginInfo.isEditMode = true;
      // 根据幻灯片名称获取其信息
      getPPTbyName({
        userid: this.loginInfo.userId,
        pptname: this.tableData[pptIdx].name
      })
        .then(res => {
          let data = JSON.parse(res.data.data);
          console.log(data)
          _this.canvasInfo.thumList = data.countList;
          _this.canvasInfo.canvasArr = data.canvasArr;
          _this.canvasInfo.canvasThum = data.canvasThum;
          _this.$router.push({
            name: "editPage",
            params: { pptName: pptname }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    /**删除幻灯片 */
    deleteRow(row) {
      console.log(row)
      var _this = this;
      // axios
      //   .post(
      //     "http://localhost:8888/api/ppt/deletePPTInfo",
      //     qs.stringify({
      //       userid: this.loginInfo.userId,
      //       pptid:row.id
      //     })
      //   )
        deletePPTInfo({
            userid: this.loginInfo.userId,
            pptid:row.id
          })
        .then(
          result => {
            console.log(result);
            _this.getAllPPTs();
            _this.$utils.tipBox("删除成功！", "success");
          },
          error => {
            console.log(error);
        });
    },
    /**返回首页 */
    returntoHome() {
      this.$router.push({ name: "home" });
    },

    showDialog() {
      this.isShowDialog = true;
    },

    closeDialog() {
      this.isShowDialog = false;
    },

    /**确认新建幻灯片 */
    sureAdd(defaultName) {
      var _this = this;
      var ifEnable = true;
      this.pptNameArr.forEach(item => {
        if (item.name === defaultName) {
          ifEnable = false;
        }
      })
      if (ifEnable) {
        this.loginInfo.isEditMode = false;
        this.defaultName = defaultName;
        this.$router.push({
          name: "editPage",
          params: { pptName: this.defaultName }
        });
      } else {
         _this.$utils.tipBox("幻灯片名称重复", "error");
      }
    }
  }
};
</script>
<style lang="scss" scope>
@import "./style/index.scss";
</style>
<style lang="scss">
.el-button--text {
  color: #0ab087 !important;
}
</style>