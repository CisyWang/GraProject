/**
 * Created by xiuxiu on 2020/1/16
 * description: axios请求全局配置
 **/
import qs from "qs";
import axios from "axios";
import config from "./config";

// 基地址
// config.baseURL = "http://www.insozhao.cn";

// axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
// axios.defaults.withCredentials = true;
// axios.defaults.timeout = 10000;

const service = axios.create(config);

// 请求拦截
service.interceptors.request.use(
  config => {
    if (config.method === "post") {
      // config.data = qs.stringify(config.data);
    }
    config.headers.common["Authorization"] = localStorage.getItem("token");
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// service.interceptors.reaponse.use(
//   response => {
//     if (response.status === 200) {
//       return Promise.resolve(response);
//     } else {
//       return Promise.reject(response);
//     }
//   },
//   error => {

//   }
// );

// 通用方法
let base = "http://www.insozhao.cn/";

export const GET = (url, params) => {
  return axios.get(`${base}${url}`, {
    params: params
  });
};

export const POST = (url, params) => {
  // return axios.post(`${base}${url}`, qs.stringify(params));
  return axios({
    url: `${base}${url}`,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

// export const GET = (url, params) => {
//   return new Promise((resolve, reject) => {
//     axios
//       .get(url, {
//         params: params
//       })
//       .then(res => {
//         resolve(res.data);
//       })
//       .catch(err => {
//         reject(err.data);
//       });
//   });
// };

// export const POST = (url, params) => {
//   return new Promise((resolve, reject) => {
//     axios
//       .get(url, qs.stringify(params))
//       .then(res => {
//         resolve(res.data);
//       })
//       .catch(err => {
//         reject(err.data);
//       });
//   });
// };

