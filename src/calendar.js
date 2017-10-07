/*
==============================
Filename     : calendar.js
Authored by  : team "Team"
Last Updated : 09 16 17
==============================
*/

var days_of_the_week = '<div class="days_of_the_week">Su</div><div class="days_of_the_week">M</div><div class="days_of_the_week">T</div><div class="days_of_the_week">W</div><div class="days_of_the_week">T</div><div class="days_of_the_week">F</div><div class="days_of_the_week">S</div>';

/**
 * Calendar object constructor<br><br>Pre conditions: none<br><br>Post conditions: Calendar object contains information about the current month
 * @param {none}
 * @return {void}
 */

function Calendar() {

    var month = monthToString(day.getMonth());
    var tempDate = new Date(day.getFullYear(), day.getMonth(), 1);

    if(month == "February") {
        this.number_of_days = checkLeapYear();
    } else if (month == "January" || month == "March" || month == "May" || month == "July" || month == "August" || month == "October" || month == "December") {
        this.number_of_days = 31;
    } else {
        this.number_of_days = 30;
    }

    /**
     * High level method that controls rendering of calendar graphic for the UI<br><br>Pre conditions: Calendar object has been instantiated<br><br>Post conditions: Calendar graphic is present in UI
     * @param {none}
     * @return {void}
     */

    this.draw = function() {
        var wrapper = document.getElementById('Calendar');
        wrapper.style.width = '185px';
        wrapper.innerHTML += '<div class="monthname">' + monthToString(day.getMonth()) + ' ' + day.getFullYear() + '</div>'
        wrapper.innerHTML += days_of_the_week;
        drawDays(day.getMonth(), this.number_of_days, tempDate.getDay());
    };
}

/**
 * Helper function that generates HTML and CSS to display calendar graphic in UI<br><br>Pre conditions: Calendar object has been instantiated<br><br>Post conditions: Calendar graphic is present in UI
 * @param {number} month_num number representing a month (0 - 11)
 * @param {number} number_of_days total number of days in current month
 * @param {number} weekday number representing current day of the month (0 - 6)
 * @return {void}
 */
function drawDays(month_num, number_of_days, weekday) {
    var wrapper = document.getElementById('Calendar');


    var today = new Date();
    var currentMonth = today.getMonth();
    var currentYear = today.getFullYear();

    var record= recordEventDayOfTheMonth(day);
    for(var i = 1; i <= number_of_days; i++) {//sort day's have event and mark them
        var mark='"';
        if(dayHasEvent(i,record)) {
            mark = ';background-color:red;color:lightyellow;"';
        }
        if(i == 1) {
            if(weekday == 0) { //wrap around when day is sunday (create a new row for the next week)
                var margin_left = 0;
            } else {
                var margin_left = weekday * 26;
            }

//while click on date, change it to red.
            if (day.getDate() == i) { //setup for first day of the month (getting month lined up)
                wrapper.innerHTML += '<div style="color:lightcoral; margin-left:' + margin_left + 'px;'+mark+'" class="day" onclick="calendarClick('+i+')">' + i + '</div>';
            } else if(day.getDate() == i) {
                wrapper.innerHTML += '<div class="day" style="color:lightcoral; margin-left:' + margin_left + 'px;'+mark+'" onclick="calendarClick('+i+')">' + i + '</div>';
            } else {
                var tmpStr='<div style="margin-left:' + margin_left + 'px;'+mark+'class="day"'+'onclick='+'calendarClick('+i+')">' + i + '</div>';
                wrapper.innerHTML += tmpStr;
            }
        } else {
            if(day.getMonth() == currentMonth && day.getFullYear() == currentYear && today.getDate() == i) {
                wrapper.innerHTML += '<div class="day" style="background-color:#02779E;color:lightyellow;'+mark+'" onclick="calendarClick('+i+')">' + i + '</div>';
            } else if(day.getDate() == i) {
                wrapper.innerHTML += '<div class="day" style="color:lightcoral;'+mark+'" onclick="calendarClick('+i+')">' + i + '</div>';
            } else {
                wrapper.innerHTML += '<div class="day" style="'+mark+'" onclick="calendarClick('+i+')">' + i + '</div>'; // Unselected cells/days except cell # 1
            }
        }
    }
}
function recordEventDayOfTheMonth(date){
    var record=new Array();
    var len=0;
    for(var k=0;k<eventsArray.length;k++){
        var tmpDate=new Date(eventsArray[k].days[0].date);
        if(tmpDate.getYear()==date.getYear()&&tmpDate.getMonth()==date.getMonth()){
            record[len]=tmpDate.getDate();
            len++;
        }
    }
    return record;
}
function dayHasEvent(day,record){
    for(var k=0;k<record.length;k++) {
        if (day == record[k])
            return true;
    }
    return false;
}

function calendarClick(num){
    cal = new Calendar();
    document.getElementById('Calendar').innerHTML = '';
    day.setDate(num);
    updateTime();
    removeExistingEvents();
//    displayEvents();
//    cal.draw();
    fixCalendarLeft();
}

/**
 * Function that determines if current year is a leap year<br><br>Pre conditions: Calendar object has been instantiated<br><br>Post conditions: none
 * @param {none}
 * @return {number} appropriate number of days in February for the current year
 *
 */

function checkLeapYear() {
    if(day.getFullYear() % 4 == 0) {
        if(day.getFullYear() % 100 == 0) {
            if(day.getFullYear() % 400 == 0) {
                return 29;
            }
            return 28;
        }
        return 29;
    }
    return 28;
}

/**
 * Helper function that corrects unexpected calendar navigation behavior when switching months. Simply simulates going forward then backward one day.<br><br>Pre conditions: Calendar graphic has been rendered<br><br>Post conditions: Calendar graphic switches months appropriately
 * @param {none}
 * @return {void}
 */

function fixCalendar() {
    dayForward();
    dayBackward();
}

/**
 * Helper function that corrects unexpected calendar navigation behavior when switching days to the previous month<br><br>Pre conditions: Calendar graphic has been rendered<br><br>Post conditions: Calendar graphic switches months appropriately
 * @param {none}
 * @return {void}
 */

function fixCalendarLeft() {
    cal = new Calendar();
    document.getElementById('Calendar').innerHTML = '';
    day.setDate(day.getDate());
    updateTime();
    removeExistingEvents();
    cal.draw();
    displayEvents();
    //
    // cal = new Calendar();
    // document.getElementById('Calendar').innerHTML = '';
    // day.setDate(day.getDate() + 1);
    // updateTime();
    // removeExistingEvents();
    // displayEvents();
    // cal.draw();
}

/**
 * Helper function that corrects unexpected calendar navigation behavior when switching days to next month<br><br>Pre conditions: Calendar graphic has been rendered<br><br>Post conditions: Calendar graphic switches months appropriately
 * @param {none}
 * @return {void}
 */

function fixCalendarRight() {
    cal = new Calendar();
    document.getElementById('Calendar').innerHTML = '';
    day.setDate(day.getDate() + 1);
    updateTime();
    removeExistingEvents();
    displayEvents();
    cal.draw();

    cal = new Calendar();
    document.getElementById('Calendar').innerHTML = '';
    day.setDate(day.getDate() - 1);
    updateTime();
    removeExistingEvents();
    displayEvents();
    cal.draw();
}
