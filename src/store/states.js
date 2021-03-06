export const state = {
  canvasInfo: {
    canvasId: 0,
    countCanvas: [{}], // canvcas 画布数量
    canvasIndex: 0, // 画布索引
    canvasArr: [], //所有（fabric产生）的canvas对象 画布状态
    canvasArrScale: [], //所有（fabric产生）的canvas对象 画布状态 缩放之后的
    canvasThum: [],  // 缩略图数据

    selectedCanvasObj: "", // 被选中的元素
    canvasObject: "",
    thumList: []  // 缩略图数组
  },
  loginInfo: {
    userId: "", // 用户id
    currentUser: "1",
    isLogin: false,
    firstLogin: false,
    nickname: "",
    isEditMode: false,
    role: -1  // 用户角色
  },
  getInfo: {
    countList: [],
    thunList: [],
    canvasArr: []
  }
}