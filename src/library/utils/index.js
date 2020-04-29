
import { Message } from "element-ui";
/**生成随机Id */
const get_Id = () => {
  let chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  let Id = "";
  for (let i = 0; i < 16; i++) {
    Id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return Id;
};

const getCurTime = () => {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var weekday = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  if (month < 10) {
    month = "0" + month;
  }
  if (weekday < 10) {
    weekday = "0" + weekday;
  }
  if (hour < 10){
    hour = "0" + hour;
  }
  if (minute < 10){
    minute = "0" + minute;
  }
  if (second < 10){
    second = "0" + second;
  }
  return (
    year +
    "/" +
    month +
    "/" +
    weekday +
    " " +
    hour +
    ":" +
    minute +
    ":" +
    second
  );
};

// 时间戳
const timeStamp = () => {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var weekday = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var millisecond = date.getMilliseconds();
  if (month < 10) {
    month = "0" + month;
  }
  if (weekday < 10) {
    weekday = "0" + weekday;
  }
  if (hour < 10){
    hour = "0" + hour;
  }
  if (minute < 10){
    minute = "0" + minute;
  }
  if (second < 10){
    second = "0" + second;
  }
  if (millisecond < 10){
    millisecond = "0" + millisecond;
  }
  return (year.toString() + month.toString() + weekday.toString() + hour.toString() + minute.toString() + second.toString() + millisecond.toString());
};

//创建uuid
const uuid = () => {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
};

// 提示框
const tipBox = (text, type) => {
  Message({
    message: text,
    type: type,
    customClass: "toast-box " + type + "-toast",
    duration: 1000,
    iconClass: "toast-box-icon " + type + "-toast-icon"
  });
};

let obj = {
  get_Id,
  getCurTime,
  timeStamp,
  tipBox,
  uuid
};


export default obj;
