/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!*****************************************!*\
  !*** ./js/sections/countdown-banner.js ***!
  \*****************************************/
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'moment'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());

if (!customElements.get('countdown-timer')) {
  class CountdownTimer extends HTMLElement {
    constructor() {
      super();
      const timezone = this.dataset.timezone,
        date = this.dataset.date.split('-'),
        day = parseInt(date[0]),
        month = parseInt(date[1]),
        year = parseInt(date[2]);
      let time = this.dataset.time,
        tarhour,
        tarmin;
      if (time != null) {
        time = time.split(':');
        tarhour = parseInt(time[0]);
        tarmin = parseInt(time[1]);
      }

      // Set the date we're counting down to
      let date_string = month + '/' + day + '/' + year + ' ' + tarhour + ':' + tarmin + ' GMT' + timezone;
      // Time without timezone
      this.countDownDate = new Date(year, month - 1, day, tarhour, tarmin, 0, 0).getTime();

      // Time with timezone
      this.countDownDate = new Date(date_string).getTime();
      this.automaticSaleTimer = this.dataset.automaticSaleTimer;
    }
    convertDateForIos(date) {
      var arr = date.split(/[- :]/);
      date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
      return date;
    }
    connectedCallback() {
      let _this = this;
      const updateTime = function () {
        let now = new Date();
        if (_this.automaticSaleTimer) {
          //core logic for timer:
          //Get the starting day , ending day and the timezone
          //Based on the timezone , convert the current date based on the timezone
          //if starting day is current day, just update the hours in current date ,and convert it based on the timezone
          //else , do the calculations based on the current date and get the future date 
          //update the hours in future date , and convert it based on the timezone
          //check if timer has started ,if yes, just set the distance or remaining time as the end date, show the sale end timer
          //else, set the distance as the starting date, to show when sale will start

          const dateData = _this.automaticSaleTimer.split(':'),
            timeZoneOffset = `${dateData[0]}`,
            startDayIndex = parseInt(dateData[1]),
            //indexed weekdays starting from sunday and 0 index, 0: sunday,
            startHour = parseInt(dateData[2]),
            startMinute = parseInt(dateData[3]),
            endDayIndex = parseInt(dateData[4]),
            //indexed weekdays starting from sunday and 0 index, 0: sunday,
            endHour = parseInt(dateData[5]),
            endMinute = parseInt(dateData[6]);
          const getnextDay = (dateInstance, index) => {
            if (!(dateInstance.getDay() == index)) {
              dateInstance.setDate(dateInstance.getDate() + ((index + 7 - dateInstance.getDay()) % 7 || 7));
            }
            return dateInstance;
          };
          const getConvertedTime = dateInstance => {
            const localTime = dateInstance.getTime();
            const convertedTime = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'moment'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(localTime).utcOffset(timeZoneOffset).format('YYYY-MM-DD HH:mm:ss');
            return new Date(convertedTime);
          };
          const setHours = (dateInstance, hour, min) => {
            return dateInstance.setHours(hour, min, 0, 0); //from shopify
          };

          //convert current time into given timezone into needed timezone
          now = getConvertedTime(now);

          //Get start day in milliseconds
          let startDay = new Date();
          startDay = getConvertedTime(startDay);
          startDay = getnextDay(startDay, startDayIndex);
          startDay = setHours(startDay, startHour, startMinute);

          //Get end day in milliseconds with timezone difference added
          //Get start day in milliseconds
          let endDay = new Date();
          endDay = getConvertedTime(endDay);
          endDay = getnextDay(endDay, endDayIndex);
          endDay = setHours(endDay, endHour, endMinute);
          console.log(new Date(startDay), "Start day");
          console.log(new Date(endDay), "End day");
          console.log(new Date(now), "now");
          let saleText = 'Starts';
          _this.countDownDate = startDay;
          let startingDistance = startDay - now; //check if sale has already started
          //it will return 0 if sale has ended, in such case, start counting from the date of next sale

          if (startingDistance < 0) {
            //sale has ended so , look for next sale starting date
            _this.countDownDate = endDay;
            saleText = 'ENDS';
            document.querySelector('.countdown-banner--timer .button').classList.add('visible');
          }
          document.querySelector('[data-timer-heading]').innerHTML = `SALE ${saleText} IN`;
        }
        const distance = _this.countDownDate - now;
        console.log(distance);

        // Time calculations for days, hours, minutes and seconds
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        let minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
        let seconds = Math.floor(distance % (1000 * 60) / 1000);
        if (distance < 0) {
          _this.querySelector('.days .countdown-timer--column--number').innerHTML = 0;
          _this.querySelector('.hours .countdown-timer--column--number').innerHTML = 0;
          _this.querySelector('.minutes .countdown-timer--column--number').innerHTML = 0;
          _this.querySelector('.seconds .countdown-timer--column--number').innerHTML = 0;
        } else {
          requestAnimationFrame(updateTime);
          _this.querySelector('.days .countdown-timer--column--number').innerHTML = CountdownTimer.addZero(days);
          _this.querySelector('.hours .countdown-timer--column--number').innerHTML = CountdownTimer.addZero(hours);
          _this.querySelector('.minutes .countdown-timer--column--number').innerHTML = CountdownTimer.addZero(minutes);
          _this.querySelector('.seconds .countdown-timer--column--number').innerHTML = CountdownTimer.addZero(seconds);
        }
      };
      requestAnimationFrame(updateTime);
    }
    static addZero(x) {
      return x < 10 && x >= 0 ? "0" + x : x;
    }
  }
  customElements.define('countdown-timer', CountdownTimer);
}
/******/ })()
;