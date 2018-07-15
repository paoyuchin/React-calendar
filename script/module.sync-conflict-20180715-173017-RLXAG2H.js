import moment from "moment/src/moment";

// $.ajax({
//   method: 'GET',
//   url: '140.115.236.72/demo-personal/bd104/web/C1700448/json/data1.json
// }).done(function (data) {
//   console.log(data);
// });

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
  initYearMonth: "201807",
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

function addEvent(event) {
  var date = moment(event.date);
  var year = date.get("year");
  var month = date.get("month");
  var date = date.get("date");
  if (!this.data[year]) {
    this.data[year] = {};
  }
  if (!this.data[year][month]) {
    this.data[year][month] = [];
  }
  if (!this.data[year][month][date]) {
    // empty
    this.data[year][month][date] = event;
  } else {
    // already has event.
    if ( //保證出團
      this.data[year][month][date].guaranteed == false &&
      event.guaranteed == true
    ) {
      this.data[year][month][date] = event;
    } else if ( //報名
      this.data[year][month][date].guaranteed == true &&
      event.guaranteed == true &&
      this.data[year][month][date].status != '報名' &&
      event.status == '報名'
      //報名 後補 預定 截止
    ) {
      this.data[year][month][date] = event;
    } else if ( //價格便宜
      this.data[year][month][date].status == '報名' &&
      event.status == '報名' &&
      this.data[year][month][date].price < event.price
    ) {
      this.data[year][month][date] = event;
    } //輸了 還是本來的比較屌
  }
}

function getEvents(yearMonth) {
  let ym = moment(yearMonth, "YYYYMM");
  return this.data[ym.get("year")][ym.get("month")];
}

function initLayout(withMonth) {
  withMonth = moment(withMonth, "YYYYMM"); //把傳進來的參數變成moment物件
  let className = this.$ele[0].className;
  // builds elements in tab box
  let preBtn = $('<div class="pre btn"></div>').append(
    $('<i class="fas fa-caret-left"></i>')
  );
  let tab = $('<span class="tab"></span>').text(
    withMonth.get("year") + " " + (withMonth.get("month") + 1) + "月"
  ); //把年份月份，傳進text函數，顯示出來
  let nextBtn = $('<div class="next btn"></div>').append(
    $('<i class="fas fa-caret-right"></i>')
  );

  // builds tab box
  let $tabBox = $('<div class="tabBox"></div>')
    .append(preBtn)
    .append(tab)
    .append(nextBtn);

  // builds tab wrap
  let $calendars_tabWrap = $(
    '<div class="' + className + '_tabWrap"></div>'
  ).append($tabBox);

  // builds weekswrap
  let $calendars_weeksWrap = $(
      '<div class="' + className + '_weeksWrap"></div>'
    )
    .append($("<span>星期日</span>"))
    .append($("<span>星期一</span>"))
    .append($("<span>星期二</span>"))
    .append($("<span>星期三</span>"))
    .append($("<span>星期四</span>"))
    .append($("<span>星期五</span>"))
    .append($("<span>星期六</span>"));

  // builds calendar
  this.$ele.append($calendars_tabWrap);
  this.$ele.append($calendars_weeksWrap);
}

function renderEvent(targetMonth) {
  targetMonth = moment(targetMonth, "YYYYMM");
  let events = this.data[targetMonth.get("year")][targetMonth.get("month")];
  let monthlyDays = targetMonth.daysInMonth();
  // console.log(monthlyDays);
  let firstWeekDay = targetMonth.startOf("month").get("weekday");
  //element
  let $date = $('<div class="date"></div>'); // .date
  // $date.append($("<span></span>"));
  let $status = $('<div class="status"></div>');
  let $group = $('<div class="group"></div>');
  let $price = $('<div class="price"></div>');
  let $sell = $('<div class="sell"></div>');
  // let $GuaranteedTripTag = $('<span class="GuaranteedTripTag"></span>').text("保證出團");

  //build hasData
  let $li = $('<li class="calendars_days"></li>');
  //build calendars_daysWrap
  let $calendars_daysWrap = $('<ul class="calendars_daysWrap"></ul>');
  console.log(events);
  for (let i = 0; i < 42; i++) {
    (function (i) {
      let _li = $li.clone();
      let _date = $date.clone();
      let _status = $status.clone();
      let _group = $group.clone();
      let _price = $price.clone();
      let _sell = $sell.clone();
      // let _GuaranteedTripTag = $GuaranteedTripTag.clone();zz
      let eventDate = i - firstWeekDay;
      if (i >= firstWeekDay && i <= monthlyDays + firstWeekDay - 1) {
        //直到需要加日期那一天
        _date.text(eventDate + 1);
        if (events[eventDate + 1]) {
          // 在這邊把event的資料放進li
          _status.text(events[eventDate + 1].status);
          _group.text("團位：" + events[eventDate + 1].totalVacnacy);
          _price.text("$" + events[eventDate + 1].price);
        }
        // $calendars_daysWrap.append(_li);
      } else {
        _li.addClass("disabled");
      } ///一進來程式會一直執行這一段
      _status.appendTo(_li);
      _group.appendTo(_li);
      _price.appendTo(_li);
      _sell.appendTo(_li);
      // _GuaranteedTripTag.appendTo(_li);
      _date.prependTo(_li);
      _li.appendTo($calendars_daysWrap);
    })(i);
  } //print all cell and give disabled color

  $calendars_daysWrap.appendTo(this.$ele);
} //renderEvent

//btn

class Module {
  constructor(ele, options) {
    this.ele = ele;
    this.$ele = $(ele);
    this.option = options;
    this.currentMonth = this.option.initYearMonth;
    this.$btnLeft = $(".pre");
    this.$btnRight = $(".next");
  }
  init() {
    const data = require("../json/data1.json");
    let dataLength = data.length;
    this.data = {};
    for (var i = 0; i < dataLength; i++) {
      addEvent.call(this, data[i]);
    } //for
    this.$btnLeft.click(() => {
      this.currentMonth = moment(this.currentMonth, 'YYYYMM').add(-1, 'M').format('YYYYMM');
    });
    this.$btnRight.click(() => {
      console.log('hi');
      this.currentMonth = moment(this.currentMonth, 'YYYYMM').add(1, 'M').format('YYYYMM');
    });
    initLayout.call(this, this.currentMonth); //從這邊接到月份 參數傳到function
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
// http: //140.115.236.72/demo-personal/bd104/web/C1700448/json/data1.json
