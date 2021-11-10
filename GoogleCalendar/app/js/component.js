

var calanderId = "";
var newValue="";
var connectorLinkName="newCalendarConnector";
var serviceName = "newCalendarConnector"
var service ="MAIL";

// Api
var getList = "https://www.googleapis.com/calendar/v3/users/me/calendarList";
var getEventsList = "https://www.googleapis.com/calendar/v3/calendars/";
var createNewEvents = "https://www.googleapis.com/calendar/v3/calendars/";


// "GoogleCalandar"; // mail

var widgetComponent = new Component();

if(service == "MAIL")
{

 ZMSDK.app.init().then(function (appInfo) {
        getId(connectorLinkName,service,serviceName);
    });

}
else if(service == "Projects")
{
 zohoprojects.init().then(function () {
		getId(connectorLinkName,service,serviceName);
 		 $('.showEventContainer').hide();
 		 $('.urlclass').hide();
 	 	$('.popup_widget').hide();
 	  	checkZproject();

	});
}
else if(service == "Desk")
{
	ZOHODESK.extension.onload().then(function (App) {
		getId(connectorLinkName,service,serviceName)

	});
}

function Component(){
}
var tree = document.createDocumentFragment();

function getId(connectorLinkName,service,serviceName)
{
	
	if(service == "Desk") // Zoho Desk
	{
		ZOHODESK.request({
			url : getList,
			type : 'GET',
			data: {},
			postBody: {},
			headers : {'Content-Type': 'application/json'},
			connectionLinkName:connectorLinkName
		}).then(function(response){
			var resultparse = JSON.parse(response);
			var resultparse2 = JSON.parse(resultparse.response);
			calanderId = resultparse2.statusMessage.items[0].id;
			newid = calanderId+"/events"; // Append ID to event Api
			getEventsList=getEventsList+newid; 
			createNewEvents = createNewEvents+calanderId+"/events?sendNotifications=true&alt=json",

			selectId(calanderId);
		});

	}
	
	else if(service == "Projects") // Zoho Projects 
	{	
	var file_detail = {
            type: "GET",
            headers: {"contentType":"application/json;charset=UTF-8"},
        };
      	var url =  getList;
        zohoprojects.request(url, file_detail,connectorLinkName).then(function (response) 
        {
        	list = response;
        	calanderId = list.result.items[0].id;
        	newid = calanderId+"/events";
			getEventsList=getEventsList+newid;
        	 selectId(calanderId);
        });
	}
	else if(service == "MAIL") // Zoho Mail
	{	
		ZMSDK.app.invokeUrl({
         xhrObj: {
             url: getList,
             headers: {
                 'Content-Type': 'application/json'
             },
             type: 'GET',
             serviceName: serviceName
             // "GoogleCalandar"
         }
     }).then(function(response) {
     	var resultparse = JSON.parse(response.response);
		calanderId = resultparse.items[0].id;
		newid = calanderId+"/events";
		cEId = calanderId+"/events?sendNotifications=true&alt=json";
		getEventsList=getEventsList+newid;
		createNewEvents = createNewEvents+cEId;
		selectId(calanderId);

     });

	}	
}
function selectId(id)
{

	subContainer = document.createElement("div");
 	subContainer.classList.add("subContainer");

 	selectDiv= document.createElement('div');
 	selectDiv.setAttribute('id','selectDiv');
 	subContainer.appendChild(selectDiv);

 	labelField =document.createElement("div");
	labelField.classList.add('fieldDiv','custom-select');
 	labelField.setAttribute('onclick',"getSelectedValue(this)");
	selectDiv.appendChild(labelField);
 	
 	componentSelect = document.createElement('select');
 	labelField.appendChild(componentSelect);

 	componentSelectOption0 =document.createElement('option');
 	componentSelectOption0.appendChild(document.createTextNode("Search"));
 	componentSelect.appendChild(componentSelectOption0);

 	componentSelectOption1 =document.createElement('option');
 	componentSelectOption1.appendChild(document.createTextNode(id));
 	componentSelect.appendChild(componentSelectOption1);

 	homeImageDiv = document.createElement('div');
 	homeImageDiv.classList.add('homeImageDiv');
 	subContainer.appendChild(homeImageDiv);

 	tree.appendChild(subContainer);
	document.getElementById("ContainerId").appendChild(tree);

	 widgetSelect('selectDiv');
	
}

function getSelectedValue(eve)
{
	 var selectedValue = $(eve).children();
	 newValue = selectedValue[1].innerText;
	 calanderId = newValue;
	  if(newValue !== 'Search')
	  {

	  	$('.createNewEventContainer').remove();
	  	 $('.homeImageDiv').hide();
	  	 $('.showEventContainer').show();
	  	 $('.selectEventDiv').remove();
	  	 $('.showEventContainer').remove();
	  	 chooseEvent();
	  	 getEvent(newValue);

	  }
}
function checkZproject()
{
	var self = this;
	 var options = self.options;
	zohoprojects.get("instances").then(function (response) 
		{
			console.log(response); 
		});
}




function getEvent(newValue)
{
	var eventData ="";

	if(service == "Desk") // Zoho Desk
	{

		ZOHODESK.request({
			url : getEventsList,
			// "https://www.googleapis.com/calendar/v3/calendars/"+calanderId+"/events",
			type : 'GET',
			data: {},
			postBody: {},
			headers : {'Content-Type': 'application/json'},
			connectionLinkName:connectorLinkName
		}).then(function(response){
			var resultparse = JSON.parse(response);
			var resultparse2 = JSON.parse(resultparse.response);
			eventData = resultparse2.statusMessage.items;
			apiResponse(eventData);
		});

	}
	else if(service == "Projects") // Zoho Projects 
	{	
		var file_detail = {
            type: "GET",
            headers: {"contentType":"application/json;charset=UTF-8"},
        };
      	var url =  getEventsList;
      	// "https://www.googleapis.com/calendar/v3/calendars/"+calanderId+"/events";
        zohoprojects.request(url, file_detail,connectorLinkName).then(function (response) 
        {
        	respData = response;
        	eventData = respData.result.items;
        	apiResponse(eventData);
        });	
    }    
    else if(service== "MAIL") // Zoho Mail
	{
		ZMSDK.app.invokeUrl({
         xhrObj: {
             url: 
              getEventsList,
      			// "https://www.googleapis.com/calendar/v3/calendars/"+calanderId+"/events",
             headers: {
                 'Content-Type': 'application/json'
             },
             type: 'GET',
             serviceName: serviceName
             // "GoogleCalandar"
         }
     }).then(function(response) {
     	
     	var resultparse = JSON.parse(response.response);
			respData = resultparse;
        	eventData = respData.items;
        	apiResponse(eventData);
     });

	}
}


function apiResponse(eventData)
{

       	for(var i=0; i<eventData.length; i++)
        	{
        		eventName = eventData[i].summary;
        		startDate = eventData[i].start;
        		endDate = eventData[i].end;
        		htmlLink = eventData[i].htmlLink;

        		eventStartDate = startDate.dateTime;
        		eventEndDate=endDate.dateTime;

        		getEventLocation =eventData[i].location;

        		var s_date = new Date(eventStartDate);
        		var eventStartTime = s_date.toLocaleTimeString('en-US');

        		var e_date = new Date(eventEndDate);
        		var eventEndTime = e_date.toLocaleTimeString('en-US');

        		var getNewDate = s_date.toString().split(' ');
        		var eventDay = getNewDate[0];
        		var month = getNewDate[1];
        		var getEventDate = getNewDate[2];
        		var year =  getNewDate[3];
        		var startTime = getNewDate[4]
        		getEventDateFormat =eventStartDate.toString().split(' ');;
        		showEvents(eventName,getEventDate,eventDay,month,eventStartTime,eventEndTime,getEventLocation,htmlLink)


        	}
         	
}

function chooseEvent()
{
	selectEventDiv = document.createElement('div');
	selectEventDiv.classList.add('selectEventDiv','br_bt');
	subContainer.appendChild(selectEventDiv); 

	selectEvent = document.createElement('div');
	selectEvent.classList.add('selectEvent','flt');
	selectEvent.setAttribute('id','selectEventId');
	// selectEvent.appendChild(document.createTextNode("Events"));
	selectEventDiv.appendChild(selectEvent);


	labelField =document.createElement("div");
	labelField.classList.add('fieldDiv','custom-select','bt_bt_blue');
 	// labelField.setAttribute();
	selectEvent.appendChild(labelField);
 	
 	componentSelect1 = document.createElement('select');
 	labelField.appendChild(componentSelect1);

 	componentSelectOption5 =document.createElement('option');
 	componentSelectOption5.appendChild(document.createTextNode("Events"));
 	componentSelect1.appendChild(componentSelectOption5);

 	componentSelectOption6 =document.createElement('option');
 	componentSelectOption6.appendChild(document.createTextNode("Today"));
 	componentSelect1.appendChild(componentSelectOption6);

 	componentSelectOption7 =document.createElement('option');
 	componentSelectOption7.appendChild(document.createTextNode("Weekly"));
 	componentSelect1.appendChild(componentSelectOption7);

 	componentSelectOption8 =document.createElement('option');
 	componentSelectOption8.append(document.createTextNode("Monthly"));
 	componentSelect1.appendChild(componentSelectOption8);

 	// selectEvent.appendChild(labelField)

	createEvent = document.createElement('div');
	createEvent.classList.add('createEvent' ,'fltRight','cursorType','marT10');
	createEvent.appendChild(document.createTextNode('+'));
	createEvent.setAttribute('onclick','createNewEvent()');
	selectEventDiv.appendChild(createEvent);

	widgetSelect('selectEventId');

}


function showEvents(eventName,getEventDate,eventDay,month,eventStartTime,eventEndTime,getEventLocation,htmlLink)
{


	$('createNewEventContainer').remove();

	showEventContainer = document.createElement('div')
	showEventContainer.classList.add("showEventContainer");
	subContainer.appendChild(showEventContainer);		


	eventContainer = document.createElement('div');
	eventContainer.classList.add('eventContainer')
	showEventContainer.appendChild(eventContainer);

	eventListDiv = document.createElement('div');
	eventListDiv.classList.add('eventListDiv');
	eventContainer.appendChild(eventListDiv);

	eventDate =document.createElement('div');
	eventDate.classList.add('flt','eventDate');
	eventListDiv.appendChild(eventDate);

	eventDateSpan = document.createElement("span");
	eventDateSpan.classList.add("eventSpan",'fntColorBlue');
	eventDateSpan.appendChild(document.createTextNode(getEventDate));
	eventDate.appendChild(eventDateSpan);

	eventDaySpan1 = document.createElement("span");
	eventDaySpan1.classList.add("eventSpan",'fntColorgray');
	eventDaySpan1.appendChild(document.createTextNode(eventDay));
	eventDate.appendChild(eventDaySpan1);

	eventMonthSpan2 = document.createElement("span");
	eventMonthSpan2.classList.add("eventSpan",'fntColorgray');
	eventMonthSpan2.appendChild(document.createTextNode(month));
	eventDate.appendChild(eventMonthSpan2);

	eventDetails =document.createElement('div');
	eventDetails.classList.add('flt','eventDetails');
	eventListDiv.appendChild(eventDetails);

	eventNameSpan = document.createElement("span");
	eventNameSpan.classList.add("eventSpan",'fntBold');
	eventNameSpan.appendChild(document.createTextNode(eventName));
	eventDetails.appendChild(eventNameSpan);

	eventTimeDiv = document.createElement('div');
	eventTimeDiv.classList.add('flt','marT5');
	eventDetails.appendChild(eventTimeDiv);

	timeIcon = document.createElement("div");
	timeIcon.classList.add('flt','icon','timeIcon');
	eventTimeDiv.appendChild(timeIcon);

	eventTime = document.createElement("div");
	eventTime.classList.add('flt','eventTime','fnt11','marL5');
	eventTimeDiv.appendChild(eventTime);


	statDate = document.createElement('span');
	statDate.classList.add('statDate');
	statDate.appendChild(document.createTextNode(eventStartTime));
	eventTime.appendChild(statDate);


	endDate = document.createElement('span');
	endDate.classList.add('statDate','mrRL10');
	endDate.appendChild(document.createTextNode(eventEndTime));
	eventTime.appendChild(endDate);


	eventLocationDiv = document.createElement('div');
	eventLocationDiv.classList.add('eventLocationDiv','flt','fnt11','marT5');
	// eventLocation.appendChild(document.createTextNode(getEventLocation));
	eventDetails.appendChild(eventLocationDiv);

	locationIcon = document.createElement("div");
	locationIcon.classList.add('flt','locationIcon','icon');
	eventLocationDiv.appendChild(locationIcon);

	eventLocation = document.createElement('div');
	eventLocation.classList.add('eventLocation','flt','marL5');
	eventLocation.appendChild(document.createTextNode(getEventLocation));
	eventLocationDiv.appendChild(eventLocation);


	eventEdit =document.createElement('div');
	eventEdit.classList.add('flt','eventEdit');
	eventListDiv.appendChild(eventEdit);

	eventActionDiv = document.createElement('div');
	eventActionDiv.classList.add('eventActionDiv','fltRight');
	eventEdit.appendChild(eventActionDiv);

	editIcon = document.createElement('div');
	editIcon.classList.add('icon','flt','marR10','editIcon');

	url = document.createElement('span');
	url.appendChild(document.createTextNode(htmlLink))
	url.classList.add('urlclass');
	editIcon.append(url);

	editIcon.setAttribute('onclick','redirection(this)');
	eventActionDiv.appendChild(editIcon);


	deleteIcon = document.createElement('div');
	deleteIcon.classList.add('icon','flt','deleteIcon');

	url = document.createElement('span');
	url.appendChild(document.createTextNode(htmlLink))
	url.classList.add('urlclass');
	deleteIcon.append(url);

	deleteIcon.setAttribute('onclick','redirection(this)');
	eventActionDiv.appendChild(deleteIcon);


	$('.urlclass').hide();
}


function createNewEvent()
{
	$('.createNewEventContainer').remove();
	$(".showEventContainer").hide();
	// widgetSelect('durationId');
	createNewEventContainer = document.createElement('div');
	createNewEventContainer.classList.add('createNewEventContainer');
	subContainer.appendChild(createNewEventContainer);

	eventsFieldsDiv = document.createElement('div');
	eventsFieldsDiv.classList.add('eventsFieldsDiv');
	createNewEventContainer.appendChild(eventsFieldsDiv);

	createEventTxt = document.createElement('div');
	createEventTxt.classList.add('createEventTxt');
	eventsFieldsDiv.appendChild(createEventTxt);

	txt = document.createElement('div');
	txt.classList.add('eventTxt','fnt13','flt','fntBold');
	txt.appendChild(document.createTextNode("Create Event"));
	createEventTxt.appendChild(txt);

	calcelIcon = document.createElement('div');
	calcelIcon.classList.add('calcelIcon','fltRight');
	calcelIcon.setAttribute("onclick","actionCancel()")
	// calcelIcon.appendChild(document.createTextNode('x'));
	createEventTxt.appendChild(calcelIcon);

	
	fields =document.createElement('div');
	fields.classList.add('fields','flt','marT15');

	eventsFieldsDiv.appendChild(fields);

	newlabel = document.createElement("Label");
	newlabel.classList.add('labelcss','mandatoryField');
	newlabel.setAttribute("for",'eventField');
	newlabel.innerHTML = "Title";
	fields.appendChild(newlabel);

	eventNameInput = document.createElement('input');
	eventNameInput.setAttribute('id','eventField')
	fields.appendChild(eventNameInput);


	chooseDateDiv = document.createElement('div');
	chooseDateDiv.classList.add('chooseDateDiv');
	fields.appendChild(chooseDateDiv);


	startDate = document.createElement('div');
	startDate.classList.add('startDate');
	startDate.setAttribute('id','startDateId');

	chooseDateDiv.appendChild(startDate);

	newlabel = document.createElement("Label");
	newlabel.classList.add('labelcss','mandatoryField');
	newlabel.setAttribute("for",'startDateId');
	newlabel.innerHTML = "Stat Date";
	startDate.appendChild(newlabel);


	startDateTime =document.createElement('div');
	startDateTime.classList.add('startDateTime');
	startDate.appendChild(startDateTime);

	statDateInput = document.createElement('input');
	statDateInput.setAttribute('id','startDateId1');
	// statDateInput.setAttribute('onchange','getEventDate()')
	statDateInput.setAttribute('type','date');
	startDateTime.appendChild(statDateInput);

	
// end date 
	
	endDate = document.createElement('div');
	endDate.classList.add('endDate');
	endDate.setAttribute('id','endDateId');
	chooseDateDiv.appendChild(endDate);

	newlabel = document.createElement("Label");
	newlabel.classList.add('labelcss','mandatoryField');
	newlabel.setAttribute("for",'endDateId');
	newlabel.innerHTML = "End Date";
	endDate.appendChild(newlabel);

	endDateTime =document.createElement('div');
	endDateTime.classList.add('endDateTime');

	endDate.appendChild(endDateTime);

	endDateInput = document.createElement('input');
	endDateInput.setAttribute('id','endDateId1');
	// endDateInput.setAttribute('onchange','getEventDate()');
	endDateInput.setAttribute('type','date');
	endDateTime.appendChild(endDateInput);

//Time 

	choosetimeDiv = document.createElement('div');
	choosetimeDiv.classList.add('choosetimeDiv');
	fields.appendChild(choosetimeDiv);

	startTime = document.createElement('div');
	startTime.classList.add('startTime');
	startTime.setAttribute('id','startTimeId')
	choosetimeDiv.appendChild(startTime);

	newlabel = document.createElement("Label");
	newlabel.classList.add('labelcss','mandatoryField');
	newlabel.setAttribute("for",'startTimeId');
	newlabel.innerHTML = "Time";
	startTime.appendChild(newlabel);

	startTimeDiv =document.createElement('div');
	startTimeDiv.classList.add('startTimeDiv');
	startTime.appendChild(startTimeDiv);

	startTimeInput = document.createElement('input');
	startTimeDiv.appendChild(startTimeInput);
	startTimeInput.setAttribute('type','time');
	startTimeInput.setAttribute('id','eventStartTimeId');
	// startTimeInput.setAttribute('onchange','getEventDate()');


// End Time

	endTime = document.createElement('div');
	endTime.classList.add('endTime');
	endTime.setAttribute('id','endTimeId')
	choosetimeDiv.appendChild(endTime);

	newlabel = document.createElement("Label");
	newlabel.classList.add('labelcss','mandatoryField');
	newlabel.setAttribute("for",'endTimeId');
	newlabel.innerHTML = "Time";
	endTime.appendChild(newlabel);

	endTimeDiv =document.createElement('div');
	endTimeDiv.classList.add('endTimeDiv','startTimeDiv');
	endTime.appendChild(endTimeDiv);

	endTimeInput = document.createElement('input');
	endTimeDiv.appendChild(endTimeInput);
	endTimeInput.setAttribute('type','time');
	endTimeInput.setAttribute('id','eventEndTimeId');
	// endTimeInput.setAttribute('onchange','getEventDate()');

// Location 

	locationDiv = document.createElement('div');
	locationDiv.classList.add('locationDiv');
	fields.appendChild(locationDiv);

	locationDivLabel = document.createElement('div');
	locationDivLabel.classList.add('locationDivLabel');
	locationDivLabel.setAttribute('id','locationId')
	locationDiv.appendChild(locationDivLabel);

	newlabel = document.createElement("Label");
	newlabel.classList.add('labelcss');
	newlabel.setAttribute("for",'locationId');
	newlabel.innerHTML = "Location";
	locationDivLabel.appendChild(newlabel);

	locationInput =document.createElement('div');
	locationInput.classList.add('locationInput');
	locationDivLabel.appendChild(locationInput);

	locationInputField = document.createElement('input');
	locationInputField.setAttribute('id','locationInputField')
	locationInput.appendChild(locationInputField);


	//attendee

	attendeeDiv = document.createElement('div');
	attendeeDiv.classList.add('attendeeDiv');
	fields.appendChild(attendeeDiv);

	attendeeInput =document.createElement('div');
	attendeeInput.setAttribute('id','attendeeId')
	attendeeInput.classList.add('attendeeInput');
	attendeeDiv.appendChild(attendeeInput);

	newlabel = document.createElement("Label");
	newlabel.classList.add('labelcss');
	newlabel.setAttribute("for",'attendeeInputField');
	newlabel.innerHTML = "Attendee";
	attendeeInput.appendChild(newlabel);

	locationInputField = document.createElement('input');
	locationInputField.setAttribute('id','attendeeInputField')
	attendeeInput.appendChild(locationInputField);

// Notification 

	notificationDiv = document.createElement('div');
	notificationDiv.classList.add('notificationDiv');
	fields.appendChild(notificationDiv);

	reminder = document.createElement('div');
	reminder.classList.add('reminder')
	notificationDiv.appendChild(reminder);

	reminderTxt = document.createElement('span');
	reminderTxt.classList.add('labelcss');
	reminderTxt.appendChild(document.createTextNode('Reminder'));
	reminder.appendChild(reminderTxt);

	notificationEnable = document.createElement('div');
	notificationEnable.classList.add('notificationEnable');
	reminder.appendChild(notificationEnable);

	radioYes = document.createElement('input');
	radioYes.setAttribute('type', 'radio');
	radioYes.setAttribute('name', 'yes');
	radioYes.setAttribute('id','enableYes')
	radioYes.classList.add('radioInput');
	notificationEnable.appendChild(radioYes);

	newlabel = document.createElement("Label");
	newlabel.classList.add('radioInputlabel');
	newlabel.setAttribute("for",'enableYes');
	newlabel.innerHTML = "Yes";
	notificationEnable.appendChild(newlabel);

	radioYes = document.createElement('input');
	radioYes.setAttribute('type', 'radio');
	radioYes.setAttribute('name', 'yes');
	radioYes.setAttribute('id','enableNo')
	radioYes.classList.add('radioInput','marL20');
	notificationEnable.appendChild(radioYes);

	newlabel = document.createElement("Label");
	newlabel.classList.add('radioInputlabel');
	newlabel.setAttribute("for",'enableNo');
	newlabel.innerHTML = "No";
	notificationEnable.appendChild(newlabel);

// radio end ..

	notification = document.createElement('div');
	notification.classList.add('notification')
	notificationDiv.appendChild(notification);

	notificationTxt = document.createElement('span');
	notificationTxt.appendChild(document.createTextNode('Notification'));
	notificationTxt.classList.add('labelcss');
	notification.appendChild(notificationTxt);



	selectEvent = document.createElement('div');
	selectEvent.classList.add('duration','flt');
	selectEvent.setAttribute('id','durationId');
	// selectEvent.appendChild(document.createTextNode("Events"));
	notification.appendChild(selectEvent);


	labelField =document.createElement("div");
	labelField.classList.add('fieldDiv','custom-select','bor1px');
 	// labelField.setAttribute();
	selectEvent.appendChild(labelField);
 	
 	componentSelect1 = document.createElement('select');
 	labelField.appendChild(componentSelect1);

 	componentSelectOption5 =document.createElement('option');
 	componentSelectOption5.appendChild(document.createTextNode("15 Minutes"));
 	componentSelect1.appendChild(componentSelectOption5);

 	componentSelectOption6 =document.createElement('option');
 	componentSelectOption6.appendChild(document.createTextNode("30 Minutes"));
 	componentSelect1.appendChild(componentSelectOption6);

 	componentSelectOption7 =document.createElement('option');
 	componentSelectOption7.appendChild(document.createTextNode("1 Hours"));
 	componentSelect1.appendChild(componentSelectOption7);

 	componentSelectOption8 =document.createElement('option');
 	componentSelectOption8.append(document.createTextNode("2 hours"));
 	componentSelect1.appendChild(componentSelectOption8);

	widgetSelect('durationId');
	//attendee
	attendeeDiv = document.createElement('div');
	attendeeDiv.classList.add('attendeeDiv');
	fields.appendChild(attendeeDiv);

	attendeeInput =document.createElement('div');
	attendeeInput.setAttribute('id','attendeeId')
	attendeeInput.classList.add('attendeeInput');
	attendeeDiv.appendChild(attendeeInput);

	newlabel = document.createElement("Label");
	newlabel.classList.add('labelcss');
	newlabel.setAttribute("for",'attendeeInputField');
	newlabel.innerHTML = "Description";
	attendeeInput.appendChild(newlabel);


	locationInputField = document.createElement('input');
	locationInputField.setAttribute('id','attendeeInputField')
	attendeeInput.appendChild(locationInputField);

	attendeeDiv = document.createElement('div');
	attendeeDiv.classList.add('attendeeDiv');
	fields.appendChild(attendeeDiv);

	attendeeInput =document.createElement('div');
	attendeeInput.setAttribute('id','attendeeId')
	attendeeInput.classList.add('attendeeInput');
	attendeeDiv.appendChild(attendeeInput);

	newlabel = document.createElement("Label");
	newlabel.classList.add('labelcss');
	newlabel.setAttribute("for",'attendeeInputField');
	newlabel.innerHTML = "Link";
	attendeeInput.appendChild(newlabel);

	locationInputField = document.createElement('input');
	locationInputField.setAttribute('id','attendeeInputField')
	attendeeInput.appendChild(locationInputField);


	duttonDiv = document.createElement('div');
	duttonDiv.classList.add('duttonDiv');
	fields.appendChild(duttonDiv);

	saveBtn = document.createElement('div');
	saveBtn.appendChild(document.createTextNode('Save'));
	saveBtn.classList.add('primary_btn','flt','fnt13');
	saveBtn.setAttribute('onclick',"getEventDate()");
	duttonDiv.appendChild(saveBtn);

	cancel = document.createElement('div');
	cancel.appendChild(document.createTextNode('Cancel'));
	cancel.classList.add('secondary_btn','flt','fnt13','marL5');
	cancel.setAttribute('onclick','actionCancel()');
	duttonDiv.appendChild(cancel);
	widgetPopup();
	$('.popup_widget').hide();

}

function widgetPopup()
{

 	var popupwidget = document.createElement('div');
	popupwidget.classList.add('popup_widget');
	var successDiv = document.createElement('div');
	successDiv.classList.add('icon_success');
	popupwidget.append(successDiv);

	iconDiv = document.createElement('div');
	iconDiv.classList.add('popupIcon');
	successDiv.append(iconDiv);

	successMsg_div = document.createElement('div');
	successMsg_div.classList.add('success_msg');
	successDiv.append(successMsg_div);

	success_msg_txt = document.createElement('div');
	success_msg_txt.classList.add('success_msg_txt');
	success_msg_txt.appendChild(document.createTextNode("Event created successfully..."));
	successMsg_div.append(success_msg_txt);

	closeicon_div = document.createElement('div');
	closeicon_div.classList.add('success_msg_txt');
	successMsg_div.append(closeicon_div);

	subContainer.append(popupwidget)
}



function warningPopup()
{

 	var popupwidget = document.createElement('div');
	popupwidget.classList.add('errorPopup');
	var successDiv = document.createElement('div');
	successDiv.classList.add('icon_success');
	popupwidget.append(successDiv);

	iconDiv = document.createElement('div');
	iconDiv.classList.add('errorIcon');
	successDiv.append(iconDiv);

	successMsg_div = document.createElement('div');
	successMsg_div.classList.add('success_msg');
	successDiv.append(successMsg_div);

	success_msg_txt = document.createElement('div');
	success_msg_txt.classList.add('success_msg_txt');
	success_msg_txt.appendChild(document.createTextNode("Error while create event.."));
	successMsg_div.append(success_msg_txt);

	closeicon_div = document.createElement('div');
	closeicon_div.classList.add('success_msg_txt');
	successMsg_div.append(closeicon_div);

	subContainer.append(popupwidget)
}



function getEventDate()
{
	var newStartDate =  document.getElementById('startDateId1').value;
	var newEventEndDate = document.getElementById('endDateId1').value;
	var newStatTime = document.getElementById('eventStartTimeId').value;
	var newEndTime = document.getElementById('eventEndTimeId').value;
	var eventName = document.getElementById('eventField').value;
	var location = document.getElementById('locationInputField').value;
	var dd = new Date();
	 var ddStr = dd.toString();
        var ddArr = ddStr.split(' ');
        var tmznSTr = ddArr[5];
        var timeZone = tmznSTr.substring(3, tmznSTr.length);
        var timeStr = timeZone.substring(0, 3) + ":" + timeZone.substring(3);

        constructStartDateTime = newStartDate+"T"+newStatTime+':00'+timeStr; //2021-09-22T16:00:00+05:30
        constructEndDateTime = newEventEndDate+"T"+newEndTime+':00'+timeStr; //2021-09-22T16:00:00+05:30

        if(eventName != " ")  
        {
	 		thirdPartPostCall(eventName,constructStartDateTime,constructEndDateTime,location);
        }
        else{
        	  
        	warningPopup();
        }
}

function redirection(eve)
{
	var newUrl = eve.children[0].innerText;
	window.open(newUrl);
	deleteEvent(newUrl);

}

function deleteEvent(newUrl)
{
	window.open(newUrl);
}

function thirdPartPostCall(eventName,constructStartDateTime,constructEndDateTime,location)
{
	

	if(service == "Desk") // Zoho Desk
	{
		
		ZOHODESK.request({
			url : createNewEvents,
			// "https://www.googleapis.com/calendar/v3/calendars/"+calanderId+"/events?sendNotifications=true&alt=json",
			headers : {'Content-Type': 'application/json'},
			type : 'POST',
			data: {},
			connectionLinkName:connectorLinkName,
			postBody: {
				"start": {
                    "dateTime": constructStartDateTime
                },
                "end": {
                    "dateTime":constructEndDateTime
                },
                "summary": eventName,
                 "location": location
           	},
			
			contentType: "application/json",dataType: "json",service :"google_calendar",
		}).then(function(response){
			var responseHeadder = JSON.parse(response);
			var statusCode = responseHeadder.statusCode;
			var postResp = responseHeadder.response;
			if(statusCode == '200')
			{
				showSuccessMessage();
				$('.createNewEventContainer').hide();
                getEvent(newValue);

			}
			else{
        		// alert('Error while create event');
        		warningPopup();
        	}
	
		});
	}
	else if(service == "MAIL") // Zoho Mail
    {
    

    		ZMSDK.app.invokeUrl({
                     xhrObj: {

                         url:createNewEvents, 
                         headers: {
                             'Content-Type': 'application/json'
                         },
                         type: 'POST',
                         serviceName: serviceName,

                         payload:{
                         		"start": {
                   					 "dateTime": constructStartDateTime
                					},
               					"end": {
                    				"dateTime":constructEndDateTime
                				},
                				"summary": eventName,
                 				"location": location
                         },
                         
                     }

                 }).then(function(response) {
                 		postCallStatus =response.status;
                 		if(postCallStatus == '200')
                 		{
                 			showSuccessMessage();
                 			$('.createNewEventContainer').hide();
                 			getEvent(newValue);
                 		}
                 		else{
        					warningPopup();
        				}

					});

    } 

	else if(service == "Projects")
	{

	var createEvent = {
            type: "POST",
            headers: {
            	 'Content-Type': 'application/json;charset=UTF-8'
            },
        };
     	var url =  createNewEvents
		createEvent.body={
			"start": {
                    "dateTime": constructStartDateTime
                },
                "end": {
                    "dateTime":constructEndDateTime
                },
                "summary": eventName,
                 "location": location
            },
        zohoprojects.request(url, createEvent,"calendarproject").then(function (response) 
        {
        	creatEventData = response;
        	postCallStatus = creatEventData.status;
        	if(postCallStatus == "success")
        	{
        		showSuccessMessage();
        		$('.createNewEventContainer').hide();
                 getEvent(newValue);
        		
        	}
        	else{
        		warningPopup();
        	}

        });
    } 
}
function showSuccessMessage()
{

	$('.popup_widget').show();
		setTimeout(function(){
			 $('.popup_widget').fadeOut('fast');
		}, 2000);//wait 2 seconds
}

function actionCancel()
{
	$('.createNewEventContainer').remove();
	$('.showEventContainer').show();
}



