import moment from "moment-timezone";

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
        tarhour, tarmin;

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

          const dateData = _this.automaticSaleTimer.split('-'),
          timezoneString = dateData[0], //timezone
          startDayIndex = parseInt(dateData[1]), //indexed weekdays starting from sunday and 0 index, 0: sunday,
          startHour = parseInt(dateData[2]),
          startMinute = parseInt(dateData[3]),
          endDayIndex = parseInt(dateData[4]), //indexed weekdays starting from sunday and 0 index, 0: sunday,
          endHour = parseInt(dateData[5]),
          endMinute = parseInt(dateData[6]);


          //convert current time into given timezone into needed timezone
          now = now.getTime();

          //Get start day in milliseconds
          let startDay = new Date();
          if (!(startDay.getDay() == startDayIndex)) {
            startDay.setDate(startDay.getDate() + (((startDayIndex + 7 - startDay.getDay()) % 7) || 7));
          }
          startDay.setHours(startHour, startMinute, 0, 0) //from shopify
          startDay = moment.tz(startDay, timezoneString);
          startDay = startDay.format('YYYY-MM-DD HH:mm'); //timezone convert and format
          startDay = new Date(startDay).getTime() //get the converted date into milliseconds
          
        //Get end day in milliseconds with timezone difference added
          let endDay = new Date();
          if (!(endDay.getDay() == endDayIndex)) {
            endDay.setDate(endDay.getDate() + (((endDayIndex + 7 - endDay.getDay()) % 7) || 7));
          }
          endDay.setHours(endHour, endMinute, 0, 0) //from shopify
          endDay = moment.tz(endDay, timezoneString);
          endDay = endDay.format('YYYY-MM-DD HH:mm');  //timezone convert and format
          endDay = new Date(endDay).getTime() //get the converted date into milliseconds
          let saleText = 'STARTS';
          _this.countDownDate = endDay;
          let startingDistance = endDay - now; //check if sale has already started
          //it will return 0 if sale has ended, in such case, start counting from the date of next sale

          if (startingDistance < 0) {
            //sale has ended so , look for next sale starting date
            _this.countDownDate = startDay;
            saleText = 'ENDS';
          }
          document.querySelector('[data-timer-heading]').innerHTML = `SALE ${saleText} IN`;
   
        }
        console.log(new Date(_this.countDownDate))
        const distance = _this.countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

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
      return (x < 10 && x >= 0) ? "0" + x : x;
    }
  }
  customElements.define('countdown-timer', CountdownTimer);
}
