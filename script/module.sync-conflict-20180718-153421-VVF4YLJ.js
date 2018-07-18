import moment from "moment/src/moment";

//Define module name here
const ModuleName = "calendar";

// $.ajax({
//   method: 'GET',
//   url: 'http: //140.115.236.72/demo-personal/bd104/web/C1700448/json/data1.json'
// }).done(function (data) {
//   console.log(data);
// });

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
  // console.log(event);
  if (!event.guaranteed) {
    // preprocess
    event.guaranteed = event.certain;
  }
  var date = moment(event.date);
  var year = date.get("year");
  var month = date.get("month");
  var date = date.get("date");
  if (!this.data[year]) {
    this.data[year] = {};
  }
  if (!this.data[year][month]) {
    this.data[year][month] = {};
  }
  if (!this.data[year][month][date]) {
    // empty
    this.data[year][month][date] = event;
  } else {
    // already has event.
    if (
      //保證出團
      this.data[year][month][date].guaranteed == false &&
      event.guaranteed == true
    ) {
      this.data[year][month][date] = event;
    } else if (
      //報名
      this.data[year][month][date].guaranteed == true &&
      event.guaranteed == true &&
      this.data[year][month][date].status != "報名" &&
      event.status == "報名"
      //報名 後補 預定 截止
    ) {
      this.data[year][month][date] = event;
    } else if (
      //價格便宜
      this.data[year][month][date].status == "報名" &&
      event.status == "報名" &&
      this.data[year][month][date].price < event.price
    ) {
      this.data[year][month][date] = event;
    } //還是本來的比較厲害
  }
}

function renderMonth(newMonth) {
  $(".tabBox span").removeClass("active");
  if (this.currentMonth - 1 < 0) {
    // no change, highlight tab1
    $(".tab1").addClass("active");
  } else if (this.currentMonth + 1 >= this.yearMonth.length) {
    // no change, highlight tab3
    $(".tab3").addClass("active");
  } else {
    // change, highlight tab2
    let str1 = this.yearMonth[this.currentMonth - 1].literal;
    let str2 = this.yearMonth[this.currentMonth].literal;
    let str3 = this.yearMonth[this.currentMonth + 1].literal;
    $("span.tab1")
      .text(str1)
      .data("title", this.yearMonth[this.currentMonth - 1].title);
    $("span.tab2")
      .text(str2)
      .data("title", this.yearMonth[this.currentMonth].title);
    $("span.tab3")
      .text(str3)
      .data("title", this.yearMonth[this.currentMonth + 1].title);
    $(".tab2").addClass("active");
  }

}

function initLayout(withMonth) {
  withMonth = moment(withMonth, "YYYYMM"); //把傳進來的參數變成moment物件
  // builds elements in tab box
  let preBtn = $('<div class="pre btn"></div>').append(
    $('<i class="fas fa-caret-left"></i>')
  );

  let monthString = ("0" + (withMonth.get("month") + 1)).slice(-2);
  //把年份月份，傳進text函數，顯示出來
  let $tab1 = $('<span class="tab1"></span>');
  let $tab2 = $('<span class="tab2"></span>');
  let $tab3 = $('<span class="tab3"></span>');
  let nextBtn = $('<div class="next btn"></div>').append(
    $('<i class="fas fa-caret-right"></i>'));

  // builds tab box
  let $tabBox = $('<div class="tabBox"></div>')
    .append(preBtn)
    .append($tab1)
    .append($tab2)
    .append($tab3)
    .append(nextBtn);
  // builds tab wrap
  let $calendars_tabWrap = $(
    '<div class="' + this.className + '_tabWrap"></div>'
  ).append($tabBox);

  // builds weekswrap
  let $calendars_weeksWrap = $(
      '<div class="' + this.className + '_weeksWrap"></div>'
    )
    .append($("<span>星期日</span>"))
    .append($("<span>星期一</span>"))
    .append($("<span>星期二</span>"))
    .append($("<span>星期三</span>"))
    .append($("<span>星期四</span>"))
    .append($("<span>星期五</span>"))
    .append($("<span>星期六</span>"));

  let $switchBtn = $('<div class="switchBtn"></div>')
    .text("換")
    .click(() => {
      this.$ele.toggleClass(this.className + "_listmode");
      this.$ele.toggleClass(this.className + "_daymode");
    });
  this.$ele.addClass(this.className + "_daymode");

  // builds calendar
  this.$ele.append($switchBtn);
  this.$ele.append($calendars_tabWrap);
  this.$ele.append($calendars_weeksWrap);

  renderMonth.call(this);
  this.$btnLeft = $(".pre");
  this.$btnRight = $(".next");

  let that = this;
  $(".tabBox span").click(function () {
    $(".tabBox span").removeClass("active");
    $(this).addClass("active");
    for (let i = 0; i < that.yearMonth.length; i++) {
      if (that.yearMonth[i].literal == $(this).text()) {
        that.currentMonth = i;
        break;
      }
    }
    renderMonth.call(that, that.yearMonth[that.currentMonth].title);
    renderEvent.call(that, that.yearMonth[that.currentMonth].title);
  });
}

function renderEvent(targetMonth) {
  targetMonth = moment(targetMonth, "YYYYMM");

  let events = this.data[targetMonth.get("year")][targetMonth.get("month")];
  let monthlyDays = targetMonth.daysInMonth();
  // console.log(monthlyDays);
  let firstWeekDay = targetMonth.startOf("month").get("weekday");
  //element
  let $date = $('<div class="date"></div>');
  let $status = $('<div class="status"></div>');
  let $group = $('<div class="group"></div>');
  let $price = $('<div class="price"></div>');
  let $sell = $('<div class="sell"></div>');
  let $weekDay = $('<div class="weekDay"></div>');
  let hasData = $('<div class="hasData"></div>');

  //build hasData
  let $li = $('<li class="' + this.className + '_days"></li>');
  //build calendars_daysWrap
  let $calendars_daysWrap = $(
    '<ul class="' + this.className + '_daysWrap"></ul>'
  );
  const weekDayArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  for (let i = 0; i < 42; i++) {
    (i => {
      let _li = $li.clone();
      let _date = $date.clone();
      let _status = $status.clone();
      let _group = $group.clone();
      let _price = $price.clone();
      let _sell = $sell.clone();
      let _weekDay = $weekDay.clone();
      let eventDate = i - firstWeekDay;
      if (i >= firstWeekDay && i <= monthlyDays + firstWeekDay - 1) {
        //直到需要加日期那一天
        _date.text(eventDate + 1);
        if (events[eventDate + 1]) {
          // 在這邊把event的資料放進li
          _date.text(eventDate + 1);
          _date.text(eventDate + 1);
          _status.text(events[eventDate + 1].status);
          _group.text("團位：" + events[eventDate + 1].totalVacnacy);
          _price.text("$" + events[eventDate + 1].price);
          _sell.text("可賣:" + events[eventDate + 1].availableVancancy);
          let weekDayIndex = moment(events[eventDate + 1].date).get('day');
          _weekDay.text(weekDayArr[weekDayIndex]);
          if (events[eventDate + 1].guaranteed) {
            let $GuaranteedTripTag = $(
              '<span class="GuaranteedTripTag"></span>'
            ).text("保證出團").addClass('hasData');
            let _GuaranteedTripTag = $GuaranteedTripTag.clone();
            _GuaranteedTripTag.appendTo(_li);
          }
          // kjb
          _li.addClass('hasData');
          _li.click(() => {
            $("li").removeClass("onClickDate");
            _li.addClass("onClickDate");
            this.option.onClickDate(_li, events[eventDate + 1]);
          });
        }
      } else {
        _li.addClass("disabled");
      }
      // 一進來程式會一直執行這一段
      _status.appendTo(_li);
      _group.appendTo(_li);
      _price.appendTo(_li);
      _sell.appendTo(_li);
      _date.prependTo(_li);
      _weekDay.appendTo(_li)
      _li.appendTo($calendars_daysWrap);
    })(i); //print all cell and give disabled color
  }
  this.$ele.find("." + this.className + "_daysWrap").remove();
  $calendars_daysWrap.appendTo(this.$ele);
} //renderEvent

class Module {
  constructor(ele, options) {
    this.ele = ele;
    this.$ele = $(ele);
    this.option = options;
    this.className = this.$ele[0].className;
  }
  init() {
    let that = this;
    $.ajax({
      type: "GET",
      url: "../json/data1.json",
      success: successCallBack(data)
    });

    var successCallBack = () => {
      let dataLength = data.length;
      this.data = {};
      this.month = [];
      for (let i = 0; i < dataLength; i++) {
        addEvent.call(this, data[i]);
      } //for
      // this.data['2018']['7']有的話
      //this.yearMonth裡面才會有 { title: '201708', literal: '2017 8月' }
      this.yearMonth = [];
      for (let year in this.data) {
        for (let month in this.data[year]) {
          month = ("0" + (parseInt(month) + 1)).slice(-2);
          // (parseInt(month) + 1): 1 based indexing for month.
          let ele = {};
          ele.title = `${year}${month}`;
          ele.literal = `${year} ${month}月`;
          this.yearMonth.push(ele);
        }
      }
      for (let i = 0; i < this.yearMonth.length; i++) {
        if (this.yearMonth[i].title == this.option.initYearMonth) {
          this.currentMonth = i;
          break;
        }
      }
      // 若輸入的年月沒有資料
      if (!this.currentMonth) {
        // 就要找相近的年月
        let distance = [];
        let initYM = moment(this.option.initYearMonth, "YYYYMM");
        for (let i = 0; i < this.yearMonth.length; i++) {
          let _i = moment(this.yearMonth[i].title, "YYYYMM");
          // https://momentjs.com/docs/#/displaying/difference/
          distance.push(_i.diff(initYM, "month"));
        }
        // 就要找相近的年月
        let min = distance.indexOf(Math.min(...distance));

        // 若前一個月後一個月都有資料
        for (let i = 0; i < distance.length; i++) {
          if (i != min && distance[i] == distance[min]) {
            let year1 = moment(this.yearMonth[i]).get("year");
            let month1 = moment(this.yearMonth[i]).get("month");
            let year2 = moment(this.yearMonth[min]).get("year");
            let month2 = moment(this.yearMonth[min]).get("month");
            // 就顯示資料比數比較多的那一個月
            if (
              Object.keys(this.data[year1][month1]).length >
              Object.keys(this.data[year2][month2]).length
            ) {
              min = i;
            }
            break;
          }
        }
        this.currentMonth = min;
      }

      initLayout.call(this, this.yearMonth[this.currentMonth].title); //從這邊接到月份 參數傳到function
      renderEvent.call(this, this.yearMonth[this.currentMonth].title);

      this.$btnLeft.click(() => {
        if (this.currentMonth - 1 > 0) {
          this.currentMonth--;
          renderEvent.call(this, this.yearMonth[this.currentMonth].title);
          $(".tab").text(this.yearMonth[this.currentMonth].literal);

          renderMonth.call(this);
        }
        this.option.onClickPrev(this.$btnLeft, this.data, this);
      });

      this.$btnRight.click(() => {
        if (this.currentMonth + 1 < this.yearMonth.length) {
          this.currentMonth++;
          renderEvent.call(this, this.yearMonth[this.currentMonth].title);
          $(".tab").text(this.yearMonth[this.currentMonth].literal);

          renderMonth.call(this);
        }
        this.option.onClickNext(this.$btnRight, this.data, this);
      });
    };
  } // first run here

  nextMonth() {
    this.$btnRight.click();
  }
  prevMonth() {
    this.$btnLeft.click();
  }

  switch () {
    this.$ele.toggleClass(this.className + "_listmode");
    this.$ele.toggleClass(this.className + "_daymode");
  }
  inputData(events) {
    for (let i = 0; i < events.length; i++) {
      let e = events[i];
      let year = moment(e.date).get("year");
      let month = moment(e.date).get("month");
      let date = moment(e.date).get("date");
      if (!this.data[year]) {
        this.data[year] = {};
      }
      if (!this.data[year][month]) {
        this.data[year][month] = {};
      }
      this.data[year][month][date] = e;
    }
  }
  resetData(events) {
    this.inputData(events);
    renderEvent.call(this, this.yearMonth[this.currentMonth].title);
  }
  destroy() {
    this.$ele.remove();
  }
}

export {
  ModuleName,
  ModuleDefaults,
  ModuleReturns,
  Module
};
// http: //140.115.236.72/demo-personal/bd104/web/C1700448/json/data1.json
