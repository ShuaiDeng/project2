/*
==============================
Filename     : mode_admin.js
Authored by  : team "Team"
Last Updated : 09 12 17
==============================
*/

var today = new Date();
var day = new Date();
var cal = new Calendar();
var unique = 0;
// Event Object

/**
 * Event object constructor<br><br>Pre conditions: none<br><br>Post conditions: Event instance is created containing relevant information
 * @param {string} host name of event creator
 * @param {string} name name of event
 * @param {string} newColor hexadecimal color code for the background color of the event on list of times (random color)
 * @param {string} date date during which the event occurs
 * @param {array} times array of strings of the times during which the event is occuring
 * @return {void}
 */

function Event(host, name, newColor, days, tasks) {
	this.host = host;
	this.name = name;
	this.title = this.name + ', hosted by ' + this.host;
	this.color = newColor;
	this.days = days; //[{date: dates, times: [times]}]
	this.tasks = tasks; //array of task objects
	this.canAttend = createCanAttend(host, days); //array of the names of people that can attend
}

/**
 * Helper function that creates the canAttend property of each event<br><br>Pre conditions: event is already instantiated<br><br>Post conditions: event object has can attend object representing who can attend the event at each time
 * @param {string} host name of event creator
 * @param {array} times array of strings of the times during which the event is occuring
 * @return {Object} key-value object containing arrays of names of who can attend the event at each time
 */

function createCanAttend(host, days) {
	var tempCanAttend = {};

	for(var x = 0; x < days.length; x++)
	for(var i = 0; i < days[x].times.length; i++) {
		tempCanAttend[days[x].date+" "+days[x].times[i]] = [host];
	}

	return tempCanAttend;
}

if(localStorage.getItem("eventsArray") != null) {
	loadEventsArray();
} else {
	var eventsArray = []; //[host, name, color, [{date:[d], times:[t]}]]
}

/**
 * Edits HTML to show event creation prompt<br><br>Pre conditions: event creation prompt must not already be displayed<br><br>Post conditions: prompt for creating events is shown
 * @param {none}
 * @return {void}
 */

function showEventCreation() {
	document.getElementById("multiday").checked = true;
	checkDay();//start off with the checkbox checked
	document.getElementById("eventCreation").style.display = "block";
	document.getElementById("eventCreationButton").style.display = "none";
	document.getElementById("availabilityCreationButton").style.display = "none";
}

/**
 * Edits HTML to hide event creation prompt<br><br>Pre conditions: event creation prompt must already be displayed<br><br>Post conditions: prompt for creating events is hidden
 * @param {none}
 * @return {void}
 */

function hideEventCreation() {
	document.getElementById("multiday").checked=false;
	event_days = [];
	document.getElementById("eventCreation").style.display = "none";
	document.getElementById("eventCreationButton").style.display = "block";
	document.getElementById("availabilityCreationButton").style.display = "block";

}

/**
 * Return times the user selected during event creation<br><br>Pre conditions: at least one time slot must be selected<br><br>Post conditions: none
 * @param {none}
 * @return {array} array of selected times for the event to take place during
 */

function getSelectedTimes() {
  var timeslots = [];
  //need for loop of event_days
  for(var i = 0; i < time_selections.length; i++) {
    if(time_selections[i].selected) {
      timeslots.push(time_selections[i].time);
    }
  }
  return timeslots;
}

/**
 * Clears all time slot selections<br><br>Pre conditions: at least one time slot must be selected<br><br>Post conditions: no time slots are selected
 * @param {none}
 * @return {void}
 */

function resetSelectedTimes() {
	var selectedDate = document.getElementById("date").innerHTML;
	for(var j = 0; j < event_days.length; j++)
	{
		if(event_days[j].date == selectedDate){
  for(var i = 0; i < event_days[j].times.length; i++) {
	  for(var x = 0; x < time_selections.length; x++)
		  if(time_selections[x].time == event_days[j].times[i])
				toggle_timeAdd(x);
  }
  }
  }
  window.location.reload();
}

/**
 * Collects information from event creation prompt and constructs an event object containing said information<br><br>Pre conditions: event must have a host, a name, and at least one selected time slot<br><br>Post conditions: event is added to eventsArray
 * @param {none}
 * @return {void}
 */

function constructEvent() {
	updateArray();
	if(event_days.length == 0) {
		alert("Please select at least one time block for your event");
	} else if(document.getElementById("host").value.length == 0) {
		alert("Please enter your name");
	} else if(document.getElementById("name").value.length == 0) {
		alert("Please enter a name for your event");
	}else {
		if(today > day) {
			alert("You cannot create an event in the past");
			resetSelectedTimes();
		} else if(eventAlreadyExisits()) {
			alert("This event already exists at one of the selected times");
			resetSelectedTimes();
		} else {
		

			var tempHost = document.getElementById("host").value;
			var tempName = document.getElementById("name").value;
			
			while(tempHost.charAt(tempHost.length - 1) == " ") {
				tempHost = tempHost.substr(0, tempHost.length - 1);
			}
			
			while(tempName.charAt(tempName.length - 1) == " ") {
				tempName = tempName.substr(0, tempName.length - 1);
			}
			
			tempHost = tempHost.replace(/</i, '');
			tempHost = tempHost.replace(/>/i, '');
			tempName = tempName.replace(/</i, '');
			tempName = tempName.replace(/>/i, '');
			
			var tempEvent = new Event(tempHost, tempName, randomColor({luminosity: 'light'}), event_days, getTasks());
			eventsArray.push(tempEvent);
			saveEventsArray();
			hideEventCreation();
			resetSelectedTimes();
		}
	}
}

/**
 * Helper function called during event creation that checks for duplicate events<br><br>Pre conditions: none<br><br>Post conditions: none
 * @param {none}
 * @return {bool} true if the event you're trying to make already exists, false if the event you're trying to make is unique
 */

function eventAlreadyExisits() {
	var tempDate = document.getElementById("date").innerHTML;
	
	var tempHost = document.getElementById("host").value;
	var tempName = document.getElementById("name").value;
	
	while(tempHost.charAt(tempHost.length - 1) == " ") {
		tempHost = tempHost.substr(0, tempHost.length - 1);
	}
	
	while(tempName.charAt(tempName.length - 1) == " ") {
		tempName = tempName.substr(0, tempName.length - 1);
	}
	
	tempHost = tempHost.replace(/</i, '');
	tempHost = tempHost.replace(/>/i, '');
	tempName = tempName.replace(/</i, '');
	tempName = tempName.replace(/>/i, '');
	var times = getSelectedTimes();

	for(var i = 0; i < eventsArray.length; i++) {
		if(eventsArray[i].name == tempName && eventsArray[i].host == tempHost) { //if two events have the same title
			for(var j = 0; j < eventsArray[i].days.length; j++) {
				for(var x = 0; x < eventsArray[i].days[j].dates.length; x++)
					if(eventsArray[i].days[j].date[x] == tempDate) //if they have the same date
						return true;
				}
			}
	}

	return false;
}

/*
* finds the event from the event array and returns its index
*/

function dayContained()
{
	for(var i = 0; i < event_days.length; i++)
	{
		if(event_days[i].date == document.getElementById("date").innerHTML)
			return i;
	}
	return -1;
}

/*
 * checks if the days has the checkbox checked and either pushes or removes from the array
*/

function checkDay()
{
	if(document.getElementById("multiday").checked)
	{
		event_days.push({date: document.getElementById("date").innerHTML, times: getSelectedTimes()});
	}
	else
	{
		var index = dayContained();
		if(index>=0)
		{
			event_days.splice(index,1);
		}
	}
}

/*
 * keeps the events_days array updated if the checkbox is checked
*/

function updateArray()
{
	if(document.getElementById("multiday").checked)
	{
		var index = dayContained();
		event_days[index] = {date: document.getElementById("date").innerHTML, times: getSelectedTimes()}
	}
}

/*
 * keeps the checkbox checked when switching between days
*/

function changeCheck()
{
	var checkBox = document.getElementById("multiday");
	if(dayContained()>=0)
	{
		checkBox.checked=true;
	}
	else
	{
		checkBox.checked=false;
	}
}

/**
 * Edits HTML to show all created events in their respective time slots for the current day<br><br>Pre conditions: none<br><br>Post conditions: all events for the day are displayed
 * @param {none}
 * @return {void}
 */

function displayEvents() {
	var selectedDate = document.getElementById("date").innerHTML;
	var time;
	for(var i = 0; i < eventsArray.length; i++) { //run through the entire eventsArray
	for(var j = 0; j< eventsArray[i].days.length; j++){
		if(eventsArray[i].days[j].date == selectedDate) {   //if an event happens today

			for(var x = 0; x < eventsArray[i].days[j].times.length; x++) { //run through the times that event is occuring

				for(var k = 0; k < document.getElementsByClassName("time").length; k++) {
					if(to24hour(document.getElementsByClassName("time")[k].innerHTML) == to24hour(eventsArray[i].days[j].times[x])) {
						time = document.getElementsByClassName("time")[k].innerHTML;
						document.getElementsByClassName("t_block")[k].innerHTML += '<div style="font-weight:800;background-color:' + eventsArray[i].color + ';" class="eventDisplay">' + eventsArray[i].title + ' ' + '<br><input type="checkbox" style="margin:25px;line-height:60px;width:auto;" class="attendButton"></input>' + '<div style="display:inline-block;font-weight:300;margin-left:-10px;">' + attendButtonText  +
						'</div><div id="detailEvent'+ (unique) + '" class="eventDetails" style="font-weight:300;">' + fillEventDetails(i, eventsArray[i].days[j].date, time) + '</div></div>';
						unique = unique + 1;
					}
				}
			}
		}}
	}
}

/**
 * Edits HTML to show who is attending a specified event at the specified time<br><br>Pre conditions: event must exist<br><br>Post conditions: information about who is attending the event is shown
 * @param {array} input array containing information about the specified event in the specified time slot
 * @return {void}
 */
 
function showEventDetails(unique) { //input is time slot that we want the details to show up in, the time slot where the button was pressed
	var selectedEvent=document.getElementById("detailEvent"+unique);
	selectedEvent.style.display = "block";
	var detailElement=document.getElementById("details"+unique);
	detailElement.style.display="none";
}

/**
 * Saves created events on local machine<br><br>Pre conditions: browser must support HTML5's localStorage API<br><br>Post conditions: events are stored for future use
 * @param {none}
 * @return {void}
 */

function saveEventsArray() {
	localStorage.setItem("eventsArray", JSON.stringify(eventsArray));
}

/**
 * Loads events previously saved on local machine<br><br>Pre conditions: browser must support HTML5's localStorage API<br><br>Post conditions: information about events created in previous sessions is stored in the eventsArray gloabl variable
 * @param {none}
 * @return {void}
 */

function loadEventsArray() {
	eventsArray = JSON.parse(localStorage.getItem("eventsArray"));
}

/**
 * Checks if events array is empty<br><br>Pre conditions: none<br><br>Post conditions: none
 * @param {none}
 * @return {bool} true if events array is empty, false if events array is not empty
 */

function isEventsArrayEmpty() {
  var eventsArrayIsEmpty = true;
  if (eventsArray.length !== 0) {
    eventsArrayIsEmpty = false;
  }
  return eventsArrayIsEmpty;
}

/**
 * Removes all saved events from your local machine<br><br>Pre conditions: there must be existing events saved on local machine, browser must suppoort HTML5's localStorage API<br><br>Post conditions: information about events on local machine is removed
 * @param {none}
 * @return {void}
 */

function clearEventsArray() {
	localStorage.removeItem("eventsArray");
	window.location.reload();
}

/**
 * Edits HTML to hide element that called this function<br><br>Pre conditions: element must not be hidden<br><br>Post conditions: element is hidden
 * @param {number} index number representing which element called this function and must be hidden
 * @return {void}
 */

function hideSelf(index) {
	document.getElementById('details' + index).style.display = "none";
}

var placement = 8;
var taskArrayNumber = 0;
function createNewTask()
{
if(taskArrayNumber == 12)
{
alert("You have reached the max limit of tasks.");
}
else
{
var newTask = document.createElement('input');
newTask.type = "text";
newTask.name = 'task';
newTask.setAttribute("class", "tasks");
//newTask.setAttribute("id", "task"+taskArrayNumber);
newTask.setAttribute("style", "display:block;line-height:24px;width:150px;margin-top:10px;");
newTask.setAttribute("placeholder","Enter task");

var event = document.getElementById("eventCreation");
event.appendChild(newTask);
event.insertBefore(newTask, event.childNodes[placement]);
placement++;
tasks[taskArrayNumber]=newTask;//may need to manually reset taskArrayNumber after resetting all arrays
taskArrayNumber++;
}
}


var taskPlacement = 8;
function displayTasks(selectedEvent)
{
let taskList = [];
for(i=0;i<tasks.length;i++)
{
taskList[i] = document.createElement('input');
taskList[i].type = "checkbox";

var event = document.getElementById("eventCreation");
selectedEvent.appendChild(taskList[i]);
selectedEvent.insertBefore(newTask, event.childNodes[taskPlacement]);
taskPlacement++;
}
}

function getTasks()
{
return tasks;
}