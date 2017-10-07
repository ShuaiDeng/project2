/*
==============================
Filename     : mode_availability.js
Authored by  : team "Team"
Last Updated : 09 12 17
==============================
*/

var attendButtonText = 'I can attend at this time';

/**
 * Edits HTML to show availability creation prompt<br><br>Pre conditions: availability creation prompt must not already be shown<br><br>Post conditions: prompt for creating availability is shown
 * @param {none}
 * @return {void}
 */

function showAvailabilityCreation() {
	document.getElementById("availabilityCreation").style.display = "block";
	document.getElementById("availabilityCreationButton").style.display = "none";
	document.getElementById("eventCreationButton").style.display = "none";
}

/**
 * Edits HTML to hide availability creation prompt<br><br>Pre conditions: availability creation prompt must already be shown<br><br>Post conditions: prompt for creating availability is hidden
 * @param {none}
 * @return {void}
 */

function hideAvailabilityCreation() {
	document.getElementById("availabilityCreation").style.display = "none";
	document.getElementById("availabilityCreationButton").style.display = "block";
	document.getElementById("eventCreationButton").style.display = "block";

}

/**
 * Edits HTML to show who is attending an event at a given time<br><br>Pre conditions: event must be instantiated<br><br>Post conditions: information about people attending the event is shown
 * @param {number} index integer representing the specified event
 * @param {string} time string representing the time at which the event takes place
 * @return {string} HTML used to display information about who is attending specified event
 */

function fillEventDetails(index, date, time) {
	console.log(eventsArray);
	var divs = '<br><div class="attending">' + Object.keys(eventsArray[index].canAttend[date+" "+to12hour(time)]).length;

	if(eventsArray[index].canAttend[date+" "+to12hour(time)].length == 1) {
		divs += ' person is attending: </div>';
	} else {
		divs += ' people are attending: </div>'
	}

	for(var i = 0; i < eventsArray[index].canAttend[date+" "+to12hour(time)].length; i++) {
		divs += '<div class="attendeeName">' + eventsArray[index].canAttend[date+" "+to12hour(time)][i] + '</div>';
	}

	divs += '<br>';

	return divs += '<br>';
}

/**
 * Collects information from availability creation prompt and stores it in the specified event objects at the specified times<br><br>Pre conditions: boxes must be checked for events user wants to attend, user must have entered a name into availability creation prompt<br><br>Post conditions: attendee information is stored in event object
 * @param {none}
 * @return {void}
 */
function constructAvailability() {
    if(document.getElementById("attendee").value.length == 0) {
        alert("Please enter your name");
    } else {
        var currentEvent;
        var eventTime;
        var eventTitle

        for(var i = 0; i < document.getElementsByClassName("attendButton").length; i++) {
            if(document.getElementsByClassName("attendButton")[i].checked) {
                eventTime = document.getElementsByClassName("attendButton")[i].parentNode.parentNode.childNodes[0].innerHTML;
                currentEvent = document.getElementsByClassName("attendButton")[i].parentNode; //add name to events canAttend list at that time
                eventTitle = currentEvent.innerText;

                for(var j = 0; j < eventsArray.length; j++) { //find the event in eventsArray
                    if(eventsArray[j].title == eventTitle.substr(0, eventsArray[j].title.length)) { //match title
                        for(var x = 0; x <eventsArray[j].days.length; x++)
                            if(eventsArray[j].days[x].date == document.getElementById("date").innerHTML)
                                for(var k = 0; k < eventsArray[j].days[x].times.length; k++) {
                                    if(eventsArray[j].days[x].times[k] == eventTime) { //match time
                                        var tempAttendee = document.getElementById("attendee").value;
                                        tempAttendee = tempAttendee.replace(/</i, '');
                                        tempAttendee = tempAttendee.replace(/>/i, '');
                                        eventsArray[j].canAttend[eventsArray[j].days[x].date+" "+eventTime].push(tempAttendee);
                                    } else if(eventsArray[j].days[x].times[k] == to12hour(eventTime)) {
                                        var tempAttendee = document.getElementById("attendee").value;
                                        tempAttendee = tempAttendee.replace(/</i, '');
                                        tempAttendee = tempAttendee.replace(/>/i, '');
                                        eventsArray[j].canAttend[eventsArray[j].days[x].date+" "+eventTime].push(tempAttendee);
                                    }
                                }
                    }
                }
            }
        }

        saveEventsArray();
        window.location.reload();
    }
}