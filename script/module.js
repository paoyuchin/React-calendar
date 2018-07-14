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

function getEvents(yearMonth) {
  let ym = moment(yearMonth, 'YYYYMM');
  return this.data[ym.get('year')][ym.get('month')];
};

function renderEvent() {
  let calendars_tabWrap = $('<div class="calendars_tabWrap"></div>');
  let tabBox = $('<div class="tabBox"></div>');
  let preBtn = $('<div class="pre btn"></div>');
  let lefticon = $('<i class="fas fa-caret-left"></i>');
  let tab = $('<span class="tab"></span>').text('2017 7月');
  let nextBtn = $('<div class="next btn"></div>');
  let righticon = $('<i class="fas fa-caret-right"></i>');
  //btn
  preBtn.append(lefticon);
  nextBtn.append(righticon);
  //calendars_weeksWrap
  let calendars_weeksWrap = $('<div class="calendars_weeksWrap"></div>');
  let sun = $('<span></span>').text('星期日');
  let monday = $('<span></span>').text('星期一');
  let tuesday = $('<span></span>').text('星期二');
  let wednesday = $('<span></span>').text('星期三');
  let thursday = $('<span></span>').text('星期四');
  let fri = $('<span></span>').text('星期五');
  let sat = $('<span></span>').text('星期六');

  //tabBox
  $('.calendars').append(calendars_tabWrap);
  calendars_tabWrap.append(tabBox);
  tabBox.append(preBtn);
  tabBox.append(tab);
  tabBox.append(nextBtn);
  //calendars_weeksWrap
  $('.calendars').append(calendars_weeksWrap);
  calendars_weeksWrap.append(sun);
  calendars_weeksWrap.append(monday);
  calendars_weeksWrap.append(tuesday);
  calendars_weeksWrap.append(wednesday);
  calendars_weeksWrap.append(thursday);
  calendars_weeksWrap.append(fri);
  calendars_weeksWrap.append(sat);
  //cell
  let calendars_daysWrap = $('<ul class="calendars_daysWrap"></ul>'); //ui
  let hasData = $('<li class="calendars_days hasData"></li>'); //li
  let date = $('<div class="date"></div>'); // li 底下
  let status = $('<div class="status"></div>');
  let group = $('<div class="group"></div>');
  let price = $('<div class="price"></div>');
  let sell = $('<div class="sell"></div>');

  calendars_daysWrap.append(hasData);
  $('.calendars').append(calendars_daysWrap);

  for (i = 0; i < 42; i++) {

    let hasData = $('<li class="calendars_days hasData"></li>'); //li
    if (hasData) {

      $格子.append(日期div)
      // if (這格有event) { //假設這格不但有日，還有event．那就把event近上去
      //   $格子.append(一堆span)
      // }
    } else {
      $格子.addClass('disabled')
    }
  }



}; //renderEvent

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
    getEvents.call(this, this.currentMonth);
    renderEvent.call(this);
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
