import moment from "moment/src/moment";

//Define module name here
const ModuleName = "calendar";

//Props default value write here
const ModuleDefaults = {
  dataSource: [
    // 資料來源的輸入接口 [ array | string ] 如果是 string的話，請輸入網址
    {
      guaranteed: true, // {boolean}
      date: "2016/12/15", // {string} YYYY/MM/DD
      price: "234567", // {string|number} XXXXXX | 近期上架
      availableVancancy: 0, // {number}
      totalVacnacy: 20, // {number}
      status: "報名" // {string} 報名(#24a07c) | 後補(#24a07c) | 預定(#24a07c) | 截止(#ff7800) | 額滿(#ff7800) | 關團(#ff7800)
    }
  ],
  // 輸入一開始要在哪一個月份 [string] YYYYMM
  //若輸入的年月沒有資料，就要找相近的年月
  //若前一個月後一個月都有資料，就顯示資料比數比較多的那一個月
  initYearMonth: "201705",
  // 設定各資料的key
  dataKeySetting: {
    // 保證出團
    guaranteed: "guaranteed",
    // 狀態
    status: "status",
    // 可賣團位
    available: "availableVancancy",
    // 團位
    total: "totalVacnacy",
    // 價格
    price: "price"
  },
  // 點上一個月時
  // @param $btn {$object} jquery 物件
  // @param $data {array} 上一個月的資料
  // @param module {object} 此模組實例物件
  onClickPrev: function ($btn, data, module) {
    console.log($btn, data, module);
  },
  // 點下一個月時
  onClickNext: function ($btn, data, module) {
    console.log($btn, data, module);
  },
  // 點日期時
  onClickDate: function ($date, data) {
    console.log($date, data);
  }
};

//Define you want to get function returns from outside of scope
const ModuleReturns = [];

class Module {
  constructor(ele, options) {
    this.ele = ele;
    this.$ele = $(ele);
    this.option = options;
    this.currentMonth = this.option.initYearMonth;
  }

  init() {
    const data = require("../json/data1.json");
    let dataLength = data.length;
    this.data = {};
    for (var i = 0; i < dataLength; i++) {
      var date = moment(data[i].date);
      var year = date.get("year");
      var month = date.get("month");
      if (!this.data[year]) {
        this.data[year] = {};
      }
      if (!this.data[year][month]) {
        this.data[year][month] = [];
      }
      this.data[year][month].push(data[i]);
    } //for

    console.log(this.data['2016']);
    console.log(this.data['2017']);
    console.log(this.data['2018']);
    console.log(this.data[year][mont]);
    //
  } // first run here

  methods() {
    return this;
  }
}

export {
  ModuleName,
  ModuleDefaults,
  ModuleReturns,
  Module
};
