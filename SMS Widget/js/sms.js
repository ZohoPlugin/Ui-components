/* $Id$ */
var smsComponent = new Component();



 // smsComponent=  function (){};

$(document).ready(function(){
	// smsComponent.getPropertyFromMeta();
});
Component.prototype.init = function () {

	ZOHO.embeddedApp.on("PageLoad", function (data) {

			currentrecord = data;
			entity = data.Entity;
			entityId = data.EntityId;
			 if(entity === "Sms_Template")
			{
				smsComponent.gotoCreateTemplate();
				$(".bulksmsTitle").hide();
				$(".createsmsTitle").show();
				smsComponent.getCrmModule();
				widgetSelect('newTemplateSelection');
				widgetSelect('SelectCrmModule');
				
			}	
			
			 if(entity !== "Sms_Template")
			 {
				ZOHO.CRM.API.getRecord({
					     Entity: entity,
					     RecordID: entityId
					}).then(function (data) {
						if ((data.data) && (data.data.length > 0)) {
							records = data.data;
							for(var j=0; j<records.length; j++){
								var record = records[j];
								var mobileNumber = record.Mobile;
								var lastName = record.Full_Name.trim();
								var recordID= record.id;
							}	
						}
							smsComponent.bulkSms(records);
							$('.errorPopup').hide();
							$('.popup_widget').hide();
							smsComponent.getRecordFromSmsTemplate();
							smsComponent.chooseTemplate(); //to get select value
							widgetSelect('LanguageSelectOptions');
					});
			}
				
	}); // pageload
	ZOHO.embeddedApp.init(); // initialize the app
};
function Component(){
	this.count = 0;
	this.password;
	this.userName;
	this.currentrecord;
	this.entity; 
	this.entityId;
	this.senderID;
	this.smsHistoryID;
	this.records ='';
	this.errorMessage ="";
	this.mainDiv="";
	this.newDiv ="";
	this.labeldiv ="";
	this.labelField="";
	this.SenderNumber ="";
	this.Sender="";
	this.Url="";
}
var tree = document.createDocumentFragment();


Component.prototype.bulkSms = function(getRecord)
{
smsComponent.getCurrentUser();

var recipientName ="";

 mainDiv = document.createElement("div");
 mainDiv.classList.add("fieldContainer","fl");

// From current user
newDiv = document.createElement("div");
newDiv.classList.add('fl','mrt30');
mainDiv.appendChild(newDiv);

labeldiv =document.createElement("div");
labeldiv.classList.add('labeldiv');

labeldiv.appendChild(document.createTextNode("From"));
newDiv.appendChild(labeldiv);

labelField =document.createElement("div");
labelField.classList.add('fieldDiv','userMobile');
newDiv.appendChild(labelField);


// Recipient
newDiv = document.createElement("div");
newDiv.classList.add('fl','mrt30');
mainDiv.appendChild(newDiv);

labeldiv =document.createElement("div");
labeldiv.classList.add('labeldiv');

labeldiv.appendChild(document.createTextNode("Recipient"));
newDiv.appendChild(labeldiv);

labelField =document.createElement("div");
labelField.classList.add('fieldDiv','recipient');
newDiv.appendChild(labelField);

// select 
selectdiv = document.createElement("div");
selectdiv.classList.add('fl','mrt30');
selectdiv.setAttribute('id' , 'templateSelectOptions');
mainDiv.appendChild(selectdiv);


selectLabel = document.createElement("div");
selectLabel.classList.add('labeldiv');
selectLabel.appendChild(document.createTextNode("Choose Template"));
selectdiv.appendChild(selectLabel);

labelField =document.createElement("div");
labelField.classList.add('fieldDiv','custom-select');
labelField.setAttribute("onclick", "smsComponent.chooseTemplate()");
selectdiv.appendChild(labelField);

selectListdiv = document.createElement('select');
selectListdiv.classList.add('templateSelect');
selectListdiv.setAttribute('id' , 'chooseTemplate');
labelField.appendChild(selectListdiv);
selectOption = document.createElement('option');
selectOption.appendChild(document.createTextNode("Choose Template"));
selectListdiv.appendChild(selectOption);

createTemplateTxt = document.createElement("div");
createTemplateTxt.classList.add('createNew');
createTemplateTxt.setAttribute("onclick", "smsComponent.showSmsTemplate()");

createTemplateSpan = document.createElement("span");
createTemplateSpan.appendChild(document.createTextNode("+ Create New"));

createTemplateTxt.append(createTemplateSpan);
selectdiv.appendChild(createTemplateTxt);
// select end 

// Select Language 
selectLanguagediv = document.createElement("div");
selectLanguagediv.classList.add('fl','mrt30');
selectLanguagediv.setAttribute('id' , 'LanguageSelectOptions');
mainDiv.appendChild(selectLanguagediv);

chooseLanguage = document.createElement("div");
chooseLanguage.classList.add('labeldiv');
chooseLanguage.appendChild(document.createTextNode("Choose Language"));
selectLanguagediv.append(chooseLanguage);

labelField =document.createElement("div");
labelField.classList.add('fieldDiv','custom-select');
selectLanguagediv.appendChild(labelField);

selectListdiv = document.createElement('select');
selectListdiv.classList.add('templateSelect1');
selectListdiv.setAttribute('id' , 'chooseLanguage');
labelField.appendChild(selectListdiv);


selectOption0 = document.createElement('option');
selectOption0.appendChild( document.createTextNode('Choose Language'));
selectOption0.value = 'Choose Language'; 

selectOption1 = document.createElement('option');
selectOption1.appendChild( document.createTextNode('English'));
selectOption1.value = 'English'; 

selectOption2 = document.createElement("option");
selectOption2.appendChild( document.createTextNode('Arabic'));
selectOption2.value = 'Arabic'; 

selectOption3 = document.createElement("option");
selectOption3.appendChild( document.createTextNode('Unicode'));
selectOption3.value = 'Unicode'; 

selectListdiv.add(selectOption0);
selectListdiv.add(selectOption1);
selectListdiv.add(selectOption2);
selectListdiv.add(selectOption3);
// selectListdiv.add(selectOption3, null);

//input field
newDiv = document.createElement("div");
newDiv.classList.add('fl','mrt30');
mainDiv.appendChild(newDiv);

labeldiv =document.createElement("div");
labeldiv.classList.add('labeldiv','titleDiv');

labeldiv.appendChild(document.createTextNode("Title"));

spanElement=document.createElement("span");
spanElement.appendChild(document.createTextNode("*"));
spanElement.classList.add('mandatory_info');

labeldiv.append(spanElement)
newDiv.appendChild(labeldiv);

labelField =document.createElement("div");
labelField.classList.add('fieldDiv');
newDiv.appendChild(labelField);
textField =document.createElement("input");
textField.setAttribute('placeholder',"Title");
textField.classList.add('titleField');
labelField.append(textField);

//Textarea
newDiv = document.createElement("div");
newDiv.classList.add('fl','mrt30');
mainDiv.appendChild(newDiv);

labeldiv =document.createElement("div");
labeldiv.classList.add('labeldiv','messageDiv');

labeldiv.appendChild(document.createTextNode("Message"));

spanElement=document.createElement("span");
spanElement.appendChild(document.createTextNode("*"));
spanElement.classList.add('mandatory_info');
labeldiv.append(spanElement)

newDiv.appendChild(labeldiv);

labelField =document.createElement("div");
labelField.classList.add('fieldDiv','h110','paddingnone','hei40');
newDiv.appendChild(labelField);
textField =document.createElement("textarea");
textField.setAttribute('placeholder',"Message");
textField.classList.add('bulkSmsTextarea');
labelField.append(textField);

newDiv = document.createElement("div");
newDiv.classList.add('fl','mrt30');
mainDiv.appendChild(newDiv);

btnDiv = document.createElement("div");
btnDiv.classList.add('btnDiv');
newDiv.append(btnDiv);

cancelBtn = document.createElement("button");
cancelBtn.classList.add('secondary_btn','marR10');
cancelBtn.appendChild(document.createTextNode("Cancel"));
cancelBtn.setAttribute("onclick", "smsComponent.closePopup()");
btnDiv.append(cancelBtn);

sendBtn = document.createElement("button");
sendBtn.classList.add('primary_btn');
sendBtn.appendChild(document.createTextNode("Send"));
sendBtn.setAttribute("onclick", "smsComponent.validateSmsDetails()");
btnDiv.append(sendBtn);

var windowFirgerDiv = document.createElement('div');
 windowFirgerDiv.classList.add('windowFirger');

// popup widget 

 	var popupwidget = document.createElement('div');
	popupwidget.classList.add('popup_widget');
	var successDiv = document.createElement('div');
	successDiv.classList.add('icon_success');
	popupwidget.append(successDiv);

	iconDiv = document.createElement('div');
	iconDiv.classList.add('icon');
	successDiv.append(iconDiv);

	successMsg_div = document.createElement('div');
	successMsg_div.classList.add('success_msg');
	successDiv.append(successMsg_div);

	success_msg_txt = document.createElement('div');
	success_msg_txt.classList.add('success_msg_txt');
	success_msg_txt.appendChild(document.createTextNode("SMS Sent successfully"));
	successMsg_div.append(success_msg_txt);

	closeicon_div = document.createElement('div');
	closeicon_div.classList.add('success_msg_txt');
	successMsg_div.append(closeicon_div);

// Error popup
var errorPopupwidget = document.createElement('div');
	errorPopupwidget.classList.add('errorPopup');

var errorMsgDiv = document.createElement('div');
	errorMsgDiv.classList.add('success_msg_txt','errorMsg');
	errorMsgDiv.appendChild(document.createTextNode("Mandatory field should not be empty"));
	errorPopupwidget.append(errorMsgDiv);

var errorMsgClose = document.createElement('div');
	errorMsgClose.classList.add('fnt20');
	errorMsgClose.setAttribute('onclick','closeError(this)')
	errorPopupwidget.append(errorMsgClose);

tree.appendChild(mainDiv);
tree.appendChild(popupwidget);
tree.appendChild(errorPopupwidget);
	
document.getElementById("smsContainer").appendChild(tree);
 	// $(".subcontainer").append(bulkSmsHtml);
	selectValue = $( "#chooseTemplate option:selected" ).text();
 	for(i=0; i<getRecord.length; i++)
	{
		var list =	getRecord[i];
		recipientName = list.Full_Name;
		$(".recipient").append( "<span data_id="+list.id+">"+recipientName+"</span>,&nbsp");
		email = list.Email;

	} 
}
Component.prototype.chooseCrmModule=function()
{
	if($("#newTemplateSelection>div.crmfield_select.custom-select").children("div").length == 2){
	 	$("#newTemplateSelection>div.crmfield_select.custom-select").children("div").remove();
	 }

	var selectedModule = $( "#chooseModule option:selected" ).text();
	ZOHO.CRM.META.getFields({"Entity":selectedModule}).then(function(data){
	moduleFields =  data.fields;
		for(i=0;i<moduleFields.length;i++)
		{
			fieldLabels =  moduleFields[i];
			fieldName =fieldLabels.api_name;
			$(".crmModules").append("<option>"+fieldName+"</option>");
		}
		widgetSelect('newTemplateSelection');

});

}
Component.prototype.chooseTemplate=function()
{
		var selectValue = $( "#chooseTemplate option:selected" ).text();
		ZOHO.CRM.API.getRecord({Entity:"Sms_Template"})
			.then(function(data){
   				var messageRecord = data.data;
   				for(i=0; i<messageRecord.length;i++)
   				{
   					record_list = messageRecord[i];	
   					record_list.Name;
   					record_list.id;
   					record_list.Module;
   					if(record_list.Name == selectValue)
   					{
   						ZOHO.CRM.API.getRecord({Entity:"Sms_Template",RecordID:record_list.id})
							.then(function(data){
    						var selectedRecord = data.data;
    						for(i=0;i<selectedRecord.length;i++)
    						{
    							selectedRecordList	= selectedRecord[i];
    							selectedRecordList.Template_Message;
    							$(".bulkSmsTextarea").empty();
    							$(".bulkSmsTextarea").append(selectedRecordList.Template_Message);
    						}	
    					});
   					}
   					

   				}
		});
}

Component.prototype.gotoCreateTemplate =function()
{

	var createTemplateHtml="";
var gotoCreateTemplate =document.createElement('div')
	gotoCreateTemplate.classList.add('createTemplate','mrt30')
	gotoCreateTemplate.setAttribute('id' , 'appendCreateTemplate');

	templateNameDiv =document.createElement('div');
	templateNameDiv.classList.add('fl');
	gotoCreateTemplate.append(templateNameDiv);

	templateLabel = document.createElement('div');
	templateLabel.classList.add('labeldiv');
	templateLabel.appendChild(document.createTextNode("Template Name"));
	spanElement=document.createElement("span");
spanElement.appendChild(document.createTextNode("*"));
spanElement.classList.add('mandatory_info');
templateLabel.append(spanElement)
	templateNameDiv.append(templateLabel);


	templateFieldDiv = document.createElement('div');
	templateFieldDiv.classList.add('fieldDiv');
	textField =document.createElement("input");
	textField.setAttribute('placeholder',"Template Name");
	textField.classList.add('titleField');
	textField.setAttribute('id','tnameField');
	templateFieldDiv.append(textField);
	templateNameDiv.append(templateFieldDiv);

// Select Language 

selectLanguagediv = document.createElement("div");
selectLanguagediv.classList.add('fl','mrt30');
selectLanguagediv.setAttribute('id' , 'SelectCrmModule');
gotoCreateTemplate.appendChild(selectLanguagediv);

chooseLanguage = document.createElement("div");
chooseLanguage.classList.add('labeldiv');
chooseLanguage.appendChild(document.createTextNode("Choose Module"));
spanElement=document.createElement("span");
spanElement.appendChild(document.createTextNode("*"));
spanElement.classList.add('mandatory_info');
chooseLanguage.append(spanElement)
selectLanguagediv.append(chooseLanguage);

labelField =document.createElement("div");
labelField.classList.add('fieldDiv','custom-select');
labelField.setAttribute('onclick','smsComponent.chooseCrmModule()');
selectLanguagediv.appendChild(labelField);

selectListdiv = document.createElement('select');
selectListdiv.classList.add('SelectModuleOptions');
selectListdiv.setAttribute('id' , 'chooseModule');
labelField.appendChild(selectListdiv);

// Create new Message 

	moduleSelectionMsg =  document.createElement('div');
	moduleSelectionMsg.classList.add('fl','mrt30')
	gotoCreateTemplate.append(moduleSelectionMsg);

	messageLabel = document.createElement('div');
	messageLabel.classList.add('labeldiv');
	messageLabel.appendChild(document.createTextNode("Message"));
	spanElement=document.createElement("span");
	spanElement.appendChild(document.createTextNode("*"));
	spanElement.classList.add('mandatory_info');
	messageLabel.append(spanElement)

	moduleSelectionMsg.append(messageLabel);
	

	messageTemplateFieldDiv = document.createElement('div');
	messageTemplateFieldDiv.classList.add('templatefieldDiv');
	moduleSelectionMsg.appendChild(messageTemplateFieldDiv);

	crmFieldDiv =document.createElement('div');
	crmFieldDiv.classList.add('crmfield');
	crmFieldDiv.setAttribute('id','newTemplateSelection');
	messageTemplateFieldDiv.append(crmFieldDiv);

	crmfieldselectDiv = document.createElement('div');
	crmfieldselectDiv.classList.add('crmfield_flt','crmfield_select','custom-select');
	crmfieldselectDiv.setAttribute('onclick','smsComponent.chooseCrmModuleFields()');
	crmFieldDiv.appendChild(crmfieldselectDiv);

	crmfieldselect = document.createElement('select');
	crmfieldselect.classList.add('crmModules');
	crmfieldselectDiv.appendChild(crmfieldselect);

	crmfieldselectOption = document.createElement('option');
	crmfieldselectOption.appendChild(document.createTextNode("Choose CrmField"));
	crmfieldselect.appendChild(crmfieldselectOption);

	insertTxt = document.createElement('div');
	insertTxt.classList.add('crmfield_flt','marTop','fnt13','marR20');
	insertTxt.appendChild(document.createTextNode("Insert Field"));
	crmFieldDiv.appendChild(insertTxt);

	createTemplateTextAreaDiv = document.createElement('div');
	createTemplateTextAreaDiv.classList.add('crmfieldDiv','h110','padding_none');
	crmFieldDiv.appendChild(createTemplateTextAreaDiv);

	createTemplateTextarea = document.createElement('textarea');
	createTemplateTextarea.setAttribute('placeholder',"Message");
	createTemplateTextarea.setAttribute('id','templateMessage');
	createTemplateTextAreaDiv.appendChild(createTemplateTextarea);

	createTemplateBtnDiv = document.createElement('div');
	createTemplateBtnDiv.classList.add('fl','mrt30');
	crmFieldDiv.appendChild(createTemplateBtnDiv);

	btnDiv = document.createElement('div');
	btnDiv.classList.add('btnDiv','mrt30');
	gotoCreateTemplate.appendChild(btnDiv);

	createTemplateCancel = document.createElement('button');
	createTemplateCancel.classList.add('secondary_btn','marR10');
	createTemplateCancel.appendChild(document.createTextNode("Cancel"));
	createTemplateCancel.setAttribute('onclick','smsComponent.hideSmsTemplate()');
	btnDiv.appendChild(createTemplateCancel);

	createTemplateSave = document.createElement('button');
	createTemplateSave.classList.add('primary_btn');
	createTemplateSave.appendChild(document.createTextNode("Save"));
	createTemplateSave.setAttribute('onclick','smsComponent.validateSmsTemplate()');
	btnDiv.appendChild(createTemplateSave);




// -----------

// popup widget 

 	var popupwidget = document.createElement('div');
	popupwidget.classList.add('popup_widget');
	var successDiv = document.createElement('div');
	successDiv.classList.add('icon_success');
	popupwidget.append(successDiv);

	iconDiv = document.createElement('div');
	iconDiv.classList.add('icon');
	successDiv.append(iconDiv);

	successMsg_div = document.createElement('div');
	successMsg_div.classList.add('success_msg');
	successDiv.append(successMsg_div);

	success_msg_txt = document.createElement('div');
	success_msg_txt.classList.add('success_msg_txt');
	success_msg_txt.appendChild(document.createTextNode("SMS Sent successfully"));
	successMsg_div.append(success_msg_txt);

	closeicon_div = document.createElement('div');
	closeicon_div.classList.add('success_msg_txt');
	successMsg_div.append(closeicon_div);

// Error popup
var errorPopupwidget = document.createElement('div');
	errorPopupwidget.classList.add('errorPopup');

var errorMsgDiv = document.createElement('div');
	errorMsgDiv.classList.add('success_msg_txt','errorMsg');
	errorMsgDiv.appendChild(document.createTextNode("Mandatory field should not be empty"));
	errorPopupwidget.append(errorMsgDiv);

var errorMsgClose = document.createElement('div');
	errorMsgClose.classList.add('fnt20');
	errorMsgClose.setAttribute('onclick','closeError(this)')
	errorPopupwidget.append(errorMsgClose);




tree.appendChild(gotoCreateTemplate);
tree.appendChild(popupwidget);
tree.appendChild(errorPopupwidget);
document.getElementById("smsContainer").appendChild(tree);

				$('.errorPopup').hide();
	$('.popup_widget').hide();


}
Component.prototype.getRecordFromSmsTemplate = function(ModuleName)
{
	 if($("#templateSelectOptions>div.fieldDiv.custom-select").children("div").length == 2){
	 	$("#templateSelectOptions>div.fieldDiv.custom-select").children("div").remove();
	 }
	 if($("#languageSelectOptions").children("div").length == 2){
	 	$("#languageSelectOptions").children("div").remove();
		 }
	ZOHO.CRM.API.getRecord({Entity:"Sms_Template"})
	.then(function(data){
    smsTemplate = data.data;
   		for(i=0; i<smsTemplate.length;i++)
    	{
    		 templateList=smsTemplate[i];
    		 templateList.id
    		 templateList.Name;
    		 templateList.Template_Message;
    		 templateList.Module;
    		 if(entity == templateList.Module)
    		 {
    		 	 $(".templateSelect").append("<option record_id="+templateList.id+">"+templateList.Name+"</option>");
    		 }

    }
    	  widgetSelect('templateSelectOptions');

	})
}


Component.prototype.getCrmModule = function()
{ 
	if($("#SelectModule>div.crmfield_select.custom-select").children("div").length == 2){
	 	$("#SelectModule>div.crmfield_select.custom-select").children("div").remove();
  }
	ZOHO.CRM.META.getModules().then(function(data){
		var crmModules= data.modules;
		for(i=0; i<crmModules.length;i++)
		{
			moduleList= crmModules[i];
			name = moduleList.module_name;
			 $('.SelectModuleOptions').append("<option>"+name+"</option>");

		}
		 widgetSelect('SelectCrmModule');
	});
}

Component.prototype.getFields =function(entity,entityId)
{
	
	if($("#newTemplateSelection>div.crmfield_select.custom-select").children("div").length == 2){
	 	$("#newTemplateSelection>div.crmfield_select.custom-select").children("div").remove();
	 }
	ZOHO.CRM.META.getFields({Entity:entity}).then(function(data){
		moduleFields =  data.fields;
		for(i=0;i<moduleFields.length;i++)
		{
			fieldLabels =  moduleFields[i];
			fieldName =fieldLabels.api_name;
			$(".crmModules").append("<option>"+fieldName+"</option>");
		}
		ZOHO.CRM.API.getRecord({
			     Entity: entity,
			     RecordID: entityId
			}).then(function (data) {
				 dummyvalue  = data;
			});
		widgetSelect('newTemplateSelection');
	});
}
Component.prototype.getCurrentUser =function()
{
	var userId="";
	ZOHO.CRM.CONFIG.getCurrentUser().then(function(data){
					userInfo = data.users;
					for(i=0; i<userInfo.length; i++)
					{
						currentUserDetail = userInfo[i];
						 userId = currentUserDetail.id;
					}
					smsComponent.getUser(userId);	

			});
					
}
Component.prototype.getUser =function(id)
{
	ZOHO.CRM.API.getUser({ID:id})
		.then(function(data){
    	crmLoginUserDetails= data.users;
    	for(i=0; i<crmLoginUserDetails.length; i++)
			{
				currentUserDetail = crmLoginUserDetails[i];
				currentUserMobile  = currentUserDetail.mobile;
				$(".userMobile").append("<span>"+currentUserMobile+"</span>");
			}
	})
}
Component.prototype.crmUpsertRecord =function(templateName,templateMessage,entity,templateField)
{
	var data = [
		{
       		Name:templateName,
       		Template_Message:templateMessage,
       		Module:entity,
       		Field:templateField,
		},
	];
		ZOHO.CRM.API.upsertRecord({Entity:"Sms_Template",APIData:data,duplicate_check_fields:["Website","Mobile"],Trigger : ["workflow"]})
			.then(function(data){
	 		smsComponent.getRecordFromSmsTemplate();
		});


}
Component.prototype.chooseCrmModuleFields = function()
{
	try{
	var templateField = $("#newTemplateSelection:first-child").find('div.select-selected').text();
	// $('#templateMessage').empty();
    var message = '${'+templateField+ '}'+' ';
	if($("#templateMessage").val()  != ""){
	 	message = message;
	 }
		 $('#templateMessage').val($('#templateMessage').val()+message); 
	
	}catch(err){
		console.log(err.message);
		}
}

Component.prototype.validateSmsDetails = function()
{
	var titleValue= $(".titleField").val();
	var bulkSmsContent = $(".bulkSmsTextarea").val();
	if((titleValue !='' && !!titleValue) && (bulkSmsContent!='' && !!bulkSmsContent))
	{	
		 var messageSplit =bulkSmsContent.split("$");
		spanObj=$(".recipient").children('span');
		
		for(var i=0; i<spanObj.length;i++)
		{
	    	data_id =$(".recipient").children('span').eq(i).attr("data_id");;
	    	smsComponent.getRecordDetails(entity,data_id,bulkSmsContent);
	 	}
	 	smsComponent.showSuccessMessage();
 	}
 	if((titleValue =='' && !titleValue) || (bulkSmsContent=='' && !bulkSmsContent))
 	{
 		smsComponent.showErrorMessage();
 	}

}

Component.prototype.getRecordDetails = function(entity,data_id,message){
 	var comma = {};
	ZOHO.CRM.API.getRecord({Entity:entity,RecordID:data_id})
			.then(async function(data){
				 comma[data_id] = data.data;
				 smsComponent.orginalMessage(data.data, message);
				return await recordArray.push(comma);
				 //return await comma;
    			},function err(e){console.log(e)});
}

var final =""
Component.prototype.orginalMessage =function(data,message){
	const regexp =/{\b\S+?\b}/g;
	//const str = 'test1${test2} is your ${hello}';
	var final =message;
	if (message.match(regexp)) {
			const array = [...message.match(regexp)];
			for(var i=0; i< array.length ; i++){
			var toFetchData = array[i].substring(1, array[i].length-1);
			final= final.replace('${'+toFetchData+'}',data[0][toFetchData]);
		}
	}else{
		 final = message;
	}
		var mobileNumber=data[0].Mobile;
		sendSms(final,mobileNumber);
}

function sendSms(message,mobileNumber)
{
	var request ={
                 	url:Url,
                     	params:{
                        	Username:'xxxxxxxxx',
                        	password:'xxxxxxxxx',
                        	language:1,
                        	sender:Sender,
                        	Mobile:mobileNumber,
                        	message:message
                        }
                 }
	ZOHO.CRM.HTTP.post(request).then(function(data){
			$('.commonmandatory').text("");
			$('.commonmandatory').show();
			$(".sucessmsg").text("");
			var SMSData = JSON.parse(data);
			if(SMSData.code == "1903");
			{
				message = "Message send successfully...";
			}


	});
}

Component.prototype.validateSmsTemplate= function()
{
	var templateName = $("#tnameField").val();
	var templateMessage =$("#templateMessage").val();
	$(".bulkSmsTextarea").text(templateMessage);
	var templateField = $("#newTemplateSelection:first-child").find('div.select-selected').text()
	if(entity == "Sms_Template")
	{
		var selectedModule = $( "#chooseModule option:selected" ).text();
		if(templateName!==''&& templateName!=='undefined'&&templateMessage!=='' &&templateMessage!== 'undefined')
		{
			smsComponent.crmUpsertRecord(templateName,templateMessage,selectedModule,templateField);
			smsComponent.saveCreateNewTemplate();
		}
		else
		{
			errorMessage = "mandatory fields are empty";
			smsComponent.showErrorMessage();
		 
		}

	}	
	else if(templateName!==''&& templateName!=='undefined'&&templateMessage!=='' &&templateMessage!== 'undefined')
	{
		smsComponent.crmUpsertRecord(templateName,templateMessage,entity,templateField);
		smsComponent.saveSmsTemplate();
	}
	else
	{
		
		errorMessage = "mandatory fields are empty";
		smsComponent.showErrorMessage();
		 
	}
}
Component.prototype.showSmsTemplate = function()
{
	
	$(".bulksmsTitle").hide();
	$(".fieldContainer").hide();
	$(".createsmsTitle").show();
	if(!$("#appendCreateTemplate").length){
	smsComponent.gotoCreateTemplate();
	$("#SelectCrmModule").hide();
	$('.errorPopup').hide();
	$('.popup_widget').hide();
	}else{
		$("#appendCreateTemplate").show();
		$("#tnameField").val('');
		$("#templateMessage").val('');
	}
	smsComponent.getFields(entity,entityId);
}
Component.prototype.saveSmsTemplate = function()
{
	$(".createsmsTitle").hide();
	$(".bulksmsTitle").show();
	$(".createTemplate").hide();
	$(".fieldContainer").show();
	$(".templateSelect").empty();
	$('.popup_widget').hide();
	$(".windowFirger").removeClass('open-firger');
	
}

Component.prototype.saveCreateNewTemplate =function()
{
	smsComponent.showSuccessMessage();
}


function createTemplate()
{
	$(".bulksmsTitle").hide();
	$(".fieldContainer").hide();
	$(".createsmsTitle").show();
	$(".createTemplate").show();
}
Component.prototype.showSuccessMessage =function()
{

		$('.popup_widget').show();
		setTimeout(function(){
 			smsComponent.closePopup();
		}, 2000);//wait 2 seconds
}
Component.prototype.showErrorMessage = function()
{

	$(".errorPopup").show();
	setTimeout(function() {
    	$('.errorPopup').fadeOut('fast');
	}, 2000); 

}
Component.prototype.hideSmsTemplate = function()
{

	$(".createTemplate").hide();
	$(".fieldContainer").show();
}

Component.prototype.closePopup = function()
{
	ZOHO.CRM.UI.Popup.close()
		.then(function(data){
    console.log(data)
	})
}



Component.prototype.getPropertyFromMeta = function()
{
	
	var metaData = document.getElementsByTagName('meta')
	for(i=0; i<metaData.length;i++)
	{
		if (metaData[i].getAttribute('name') == "Phone") {
      	 Phone = metaData[i].getAttribute('content');
      	}
      	if (metaData[i].getAttribute('name') == "Url") {
      	 Url = metaData[i].getAttribute('content');
      	}
      	if (metaData[i].getAttribute('name') == "userName") {
      	 userName = metaData[i].getAttribute('content');
      	}

    }
}



