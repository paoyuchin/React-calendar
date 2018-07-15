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
}

function initLayout(withMonth) {
  withMonth = moment(withMonth, 'YYYYMM'); //把傳進來的參數變成moment物件
  let className = this.$ele[0].className;
  // builds elements in tab box
  let preBtn = $('<div class="pre btn"></div>').append($('<i class="fas fa-caret-left"></i>'));
  let tab = $('<span class="tab"></span>')
    .text(withMonth.get('year') + ' ' + (withMonth.get('month') + 1) + '月'); //把年份月份，傳進text函數，顯示出來
  let nextBtn = $('<div class="next btn"></div>').append($('<i class="fas fa-caret-right"></i>'));

  // builds tab box
  let $tabBox = $('<div class="tabBox"></div>')
    .append(preBtn)
    .append(tab)
    .append(nextBtn);

  // builds tab wrap
  let $calendars_tabWrap = $('<div class="' + className + '_tabWrap"></div>').append($tabBox);

  // builds weekswrap
  let $calendars_weeksWrap = $('<div class="' + className + '_weeksWrap"></div>')
    .append($('<span>星期日</span>'))
    .append($('<span>星期一</span>'))
    .append($('<span>星期二</span>'))
    .append($('<span>星期三</span>'))
    .append($('<span>星期四</span>'))
    .append($('<span>星期五</span>'))
    .append($('<span>星期六</span>'));

  // builds calendar
  this.$ele.append($calendars_tabWrap);
  this.$ele.append($calendars_weeksWrap);
}

function renderEvent(targetMonth) {
  targetMonth = moment(targetMonth, 'YYYYMM');
  let monthlyDays = targetMonth.daysInMonth();
  console.log(monthlyDays);
  let firstWeekDay = targetMonth.startOf('month').get('weekday');
  console.log('firstWeekDay', firstWeekDay);
  //element
  let $date = $('<div class="date"></div>'); // .date
  $date.append($('<span></span>'));
  let $status = $('<div class="status"></div>');
  let $group = $('<div class="group"></div>');
  let $price = $('<div class="price"></div>');
  let $sell = $('<div class="sell"></div>');

  //build hasData
  let $li = $('<li class="calendars_days"></li>')
  //build calendars_daysWrap
  let $calendars_daysWrap = $('<ul class="calendars_daysWrap"></ul>');
  for (let i = 0; i < 42; i++) {
    (function (i) {
      let _li = $li.clone();
      let _date = $date.clone();
      if (i >= firstWeekDay && i <= monthlyDays) {
        _date
          .children('span')
          .text(i - firstWeekDay + 1);
      } else {
        _li.addClass('disabled');
      }
      _date.appendTo(_li);
      $calendars_daysWrap.append(_li);
    })(i);
  } //print all cell and give disabled color

  this.$ele.append($calendars_daysWrap);
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
    initLayout.call(this, this.currentMonth); //從這邊接到月份 參數傳到function
    getEvents.call(this, this.currentMonth);
    renderEvent.call(this, this.currentMonth);
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
