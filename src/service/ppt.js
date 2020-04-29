import * as API from "./index";

/**保存 PPT 信息 */
export const savePPT = params => {
  return API.POST("api/ppt/savePPTInfo", params);
};

/**获取用户所有的 PPT */
export const getAllPPTs = params => {
  return API.GET("api/ppt/getPPTInfo", params);
};

/**根据 PPT 名称获取 PPT */
export const getPPTbyName = params => {
  return API.GET("api/ppt/getPPTInfoByPptname", params);
};

/**删除 PPT 信息 */
export const deletePPTInfo = params => {
  return API.POST("api/ppt/deletePPTInfo", params);
}