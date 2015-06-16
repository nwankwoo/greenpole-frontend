var administratorCount=0;
	
var primaryEmailState2=0;
var primaryEmailState=0;
var primaryNumberState=0;	
var primaryNumberState2=0;

var JSONArray = [];
var tempJSON;
var administratorvalid=false;
var primaryAddress="residential";
var JSONSelectedIndex;
var edit=false;
var createAdministrator = angular.module("createAdministrator",[]);
createAdministrator.controller("createAdministratorController",function($scope){
	$scope.administratorList=[];
	
	$scope.addAdministrator = function(){
		
		$(".error-alert").hide();
		
			var phoneNumberOneValidator=false;
			var phoneNumberTwoValidator=false;
			
			var phoneNumberOneChecked=$(".phoneNumberOne").parent().find(".makePrimaryNumberOne").is(":checked");
			var phoneNumberTwoChecked=$(".phoneNumberTwo").parent().find(".makePrimaryNumberTwo").is(":checked");
			
			var phoneNumberOne=$(".phoneNumberOneText").val();
			var phoneNumberTwo=$(".phoneNumberTwoText").val();
			
			
			if(phoneNumberOneChecked){
				if( phoneNumberOne!="" ){
				phoneNumberOneValidator=true;
				
				}
				else{
					phoneNumberOneValidator=false;
				}
			}
			
			
			
			if(phoneNumberTwoChecked ){
				if(phoneNumberTwo!=""){
				phoneNumberTwoValidator=true;
				}
				else{
					phoneNumberTwoValidator=false;
				}
			}
			
			if(phoneNumberOneValidator==false && phoneNumberTwoValidator==false){
				$(".error-alert").show();
				return false;
			}
		
			var phoneNumbers = [];
			console.clear();
			console.log($.parseJSON($('.phoneNumberOne :input').formToJSON()));
			phoneNumbers.push($.parseJSON($('.phoneNumberOne :input').formToJSON()));
			phoneNumbers.push($.parseJSON($('.phoneNumberTwo :input').formToJSON()));			
			tempJSON['phoneNumbers'] = phoneNumbers;
			
			if(JSONArray.length<=0){
				JSONArray.push(tempJSON);
			}
			else{
				$firstName=$(".firstName").val();
			$middleName=$(".middleName").val();
			$lastName=$(".lastName").val();
			$availale=false;
			$index=0;
				$.each(JSONArray,function(index,value){
					if(value.firstName===$firstName && value.middleName===$middleName && value.lastName===$lastName){
						$available=true;
						$index=index;
					}
				});
				
				if(!$available){
					
					if(edit){
						JSONArray[JSONSelectedIndex]=tempJSON;
					}
					else{
						JSONArray.push(tempJSON);
					}
				}
				else{
					JSONArray[$index]=tempJSON;
				}
			}
			
			
			console.log(JSONArray);
			$scope.administratorList=[];
			$scope.notavailable=false;
			var index=0;
			angular.forEach(JSONArray,function(administrator){
					$scope.administratorJSON={id:JSONArray.length-1 ,administratorName : administrator.firstName+" "+administrator.middleName+" "+ administrator.lastName}
					
						$scope.administratorList.push($scope.administratorJSON);
					
					index++;
					
				})
				tempJSON="";
			
				
				 $(".administratorsContainer :input").val("");	
				 $(".addAdministrator").val("Add Administrator");
				$(".administratorContactDetailsPersonalDetails").click();
				administratorvalid=true;
				edit=false;
				$(".success-alert").show();
			
			
		}//end of addAdministrator
		
		$scope.getAdministrator=function(administrator){
			$scope.id=administrator.id;
			JSONSelectedIndex=$scope.id;
			var administratorJSON=JSONArray[$scope.id];
			console.log("adminjson="+administratorJSON.firstName);
			$(".firstName").val(administratorJSON.firstName).prop("readonly",true);
			$(".middleName").val(administratorJSON.middleName).prop("readonly",true)
			$(".lastName").val(administratorJSON.lastName).prop("readonly",true);
			$(".dob").val(administratorJSON.dob).prop("readonly",true);
			$(".residentialAddressLine1").val(administratorJSON.residentialAddress.addressLine1).prop("readonly",true)
			$(".residentialAddressLine2").val(administratorJSON.residentialAddress.addressLine2).prop("readonly",true)
			$(".residentialAddressLine3").val(administratorJSON.residentialAddress.addressLine3).prop("readonly",true)
			$(".residentialAddressLine4").val(administratorJSON.residentialAddress.addressLine4).prop("readonly",true)
			$(".residentialPostCode").val(administratorJSON.residentialAddress.postCode).prop("readonly",true)
			$(".residentialCity").val(administratorJSON.residentialAddress.city).prop("readonly",true)
			$(".residentialState").val(administratorJSON.residentialAddress.state).prop("readonly",true)
			$(".residentialCountry").val(administratorJSON.residentialAddress.country).prop("readonly",true)
			$(".postalAddressLine1").val(administratorJSON.postalAddress.addressLine1).prop("readonly",true)
			$(".postalAddressLine2").val(administratorJSON.postalAddress.addressLine2).prop("readonly",true)
			$(".postalAddressLine3").val(administratorJSON.postalAddress.addressLine3).prop("readonly",true)
			$(".postalAddressLine4").val(administratorJSON.postalAddress.addressLine4).prop("readonly",true)
			$(".postalAddressPostCode").val(administratorJSON.postalAddress.postCode).prop("readonly",true)
			$(".postalAddressCity").val(administratorJSON.postalAddress.city).prop("readonly",true)
			$(".postalAddressState").val(administratorJSON.postalAddress.state).prop("readonly",true);
			$(".postalAddressCountry").val(administratorJSON.postalAddress.country).prop("readonly",true)
			$(".emailAddressOne").val(administratorJSON.emailAddresses[0].emailAddress).prop("readonly",true);
			$(".emailAddressTwo").val(administratorJSON.emailAddresses[1].emailAddress).prop("readonly",true);
			$(".phoneNumberOneText").val(administratorJSON.phoneNumbers[0].phoneNumber).prop("readonly",true);
			$(".phoneNumberTwoText").val(administratorJSON.phoneNumbers[1].phoneNumber).prop("readonly",true)
			$(".removeAdministrator").show();
			$(".editAdministrator").show();
		}
		
		$scope.resetForm=function(){
			$(".success-alert").hide();
			JSONArray = [];
			 tempJSON;
			 administratorvalid=false;
			 primaryAddress="residential";
			 $(".addAdministrator").val("Add Administrator");
			 JSONSelectedIndex;
			 edit=false;
		}
});

$(function(){
	var nowTemp = new Date();
var _back =(nowTemp.getFullYear()-18);
var now = new Date(_back, nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
$('.dob').fdatepicker({
					onRender: function (date) {
						return date.valueOf() < now.valueOf() ? '' : 'disabled';
					}
				})
				
	var location="";
var emailexpression=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
var regex = new RegExp(emailexpression);
$(".next").click(function(e) {
	var valid=false;
	$(".error-alert").hide();
	$("error-alert").find(".alert").text("Please fill out all entries marked * to continue and make sure they contain the right entries");
	$(".success-alert").hide();
    switch(location){
		case "":
			valid = $(".firstName").val()=="" || $(".lastName").val()=="" || $(".dob").val() =="" ? false : true;
			if(!valid){
				$(".error-alert").show();
				return false;
			}
			tempJSON = $('#administratorContactDetailsPersonalDetails :input').formToJSON();
			tempJSON=$.parseJSON(tempJSON)
			$(".administratorAddressSettings").click();
			location="addressSettings";
			$(".previous").show();
			break;
		case "addressSettings":
			$(".administratorContactDetailsResidential").click();			
			location="administratorContactDetailsResidential";
			tempJSON['pryAddress'] = primaryAddress;
			break;
		case "administratorContactDetailsResidential":
		if(primaryAddress==="residential"){
			valid = $(".residentialAddressLine1").val()=="" ||  $(".residentialCity").val()=="" || $(".residentialState").val()=="" || $(".residentialCountry").val()=="" ? false : true;
			if(!valid){
				$(".error-alert").show();
				return false;
			}
		}
			//var residential=[];
			tempJSON=$.extend(true,tempJSON,tempJSON,$.parseJSON($('#administratorContactDetailsResidential :input').formToJSON()))
			///residential.push($.parseJSON($('#administratorContactDetailsResidential :input').formToJSON()));
			//$.extend(true,tempJSON,tempJSON,)
			//tempJSON['residentialAddress']=residential;
			$(".administratorContactDetailsPostal").click();
			$(".error-alert").hide();
			location="administratorContactDetailsPostal";
			break;
		case "administratorContactDetailsPostal":
			if(primaryAddress==="postal"){
			valid = $(".postalAddressLine1").val()==""  || $(".postalAddressCity").val()=="" || $(".postalAddressState").val()=="" || $(".postalAddressCountry").val()=="" ? false : true;
			if(!valid){
				$(".error-alert").show();
				return false;
			}
			}
			tempJSON=$.extend(true,tempJSON,tempJSON,$.parseJSON($('#administratorContactDetailsPostal :input').formToJSON()))
			//var postal=[];
			//postal.push($.parseJSON($('#administratorContactDetailsPostal :input').formToJSON()));
			//$.extend(true,tempJSON,tempJSON,)
			//tempJSON['postalAddress']=postal;
			$(".administratorContactDetailsEmail").click();
			$(".error-alert").hide();
			location="administratorContactDetailsEmail";
			break;
		case "administratorContactDetailsEmail":
			var emailOneValidator=false;
			var emailTwoValidator=true;
			
			var emailOneChecked=$(".emailAddressOne").parent().find(".makePrimaryEmailOne").is(":checked");
			var emailTwoChecked=$(".emailAddressTwo").parent().find(".makePrimaryEmailTwo").is(":checked");
			
			var emailAddressOne=$(".emailAddressOne").val();
			var emailAddressTwo=$(".emailAddressTwo").val();
			
			if(emailOneChecked && validateEmail(emailAddressOne) ){
				emailOneValidator=true;
			}
			
			if(!emailOneChecked){
				 if (emailAddressOne!=""){
					 if(!validateEmail(emailAddressOne)  ){
						emailOneValidator=false;
					 }
				 }
				 else{
					 emailOneValidator=true;
				 }
			}
			
			if(emailTwoChecked && validateEmail(emailAddressTwo) ){
				emailTwoValidator=true;
			}
			
			if(!emailTwoChecked){
				if( emailAddressTwo!=""){
					if(!validateEmail(emailAddressTwo) ){
						emailTwoValidator=false;
					}
				}
				 else{
					 emailTwoValidator=true;
				 }
			}
			
			if(emailOneValidator==false || emailTwoValidator==false){
				$(".error-alert").show();
				return false;
			}
			
			var email = [];
			email.push($.parseJSON($('.emailDetailsOne :input').formToJSON()));
			email.push($.parseJSON($('.emailDetailsTwo :input').formToJSON()));			
			tempJSON['emailAddresses'] = email;
			$(".administratorContactDetailsPhone").click();
			$(".error-alert").hide();
			location="administratorContactDetailsPhone";
			$(".next").hide();
			break;
		default:
			break;
	}
	
});
$(".selectPrimaryAddress").change(function(e) {
    primaryAddress=$(this).val();
});
$(".administratorContactDetailsPersonalDetails").click(function(e) {
    location="";
	$(".next").show();
	$(".previous").hide();
});
$(document).on("click",".previous",function(e) {
	
    switch(location){
		case "administratorContactDetailsPhone":
			$(".administratorContactDetailsEmail").click();
			location="administratorContactDetailsEmail";
			$(".next").show();
			break;		
		case "administratorContactDetailsEmail":
			$(".administratorContactDetailsPostal").click();
			location="administratorContactDetailsPostal";
			break;
		case "administratorContactDetailsPostal":
			$(".administratorContactDetailsResidential").click();
			location="administratorContactDetailsResidential";
			break;
		case "administratorContactDetailsResidential":
			$(".administratorAddressSettings").click();
			location="addressSettings";
			break;
		case "addressSettings":
			$(".administratorContactDetailsPersonalDetails").click();
			location="";
			$(".previous").hide();
			break;
		default:
			break;
	}
});


/*$(".addAdministrator").click(function(e) {
    $html=$(".administratorsContainer").clone();
	administratorCount++;
	console.log(administratorCount);
	$html.remove(".tabs");
	$(".administratorHolder").append($html);
	
	$parent=$(this).parent().parent();
	$parent.find(".firstName").attr("name","administrators["+administratorCount+"].firstName");
	$parent.find(".middleName").attr("name","administrators["+administratorCount+"].middleName");
	$parent.find(".lastName").attr("name","administrators["+administratorCount+"].lastName");
	$parent.find(".dob").attr("name","administrators["+administratorCount+"].dob");
	
	$parent.find(".residentialAddressLine1").attr("name","administrators["+administratorCount+"].residentialAddress.addressLine1");
	$parent.find(".residentialAddressLine2").attr("name","administrators["+administratorCount+"].residentialAddress.addressLine2");
	$parent.find(".residentialAddressLine3").attr("name","administrators["+administratorCount+"].residentialAddress.addressLine3");
	$parent.find(".residentialAddressLine4").attr("name","administrators["+administratorCount+"].residentialAddress.addressLine4");
	$parent.find(".residentialAddressPostCode").attr("name","administrators["+administratorCount+"].residentialAddress.postCode");
	$parent.find(".residentialAddressState").attr("name","administrators["+administratorCount+"].residentialAddress.state");
	$parent.find(".residentialAddressCity").attr("name","administrators["+administratorCount+"].residentialAddress.city");
	$parent.find(".residentialAddressCountry").attr("name","administrators["+administratorCount+"].residentialAddress.country");
	
	$parent.find(".postalAddressLine1").attr("name","administrators["+administratorCount+"].postalAddress.addressLine1");
	$parent.find(".postalAddressLine2").attr("name","administrators["+administratorCount+"].postalAddress.addressLine2");
	$parent.find(".postalAddressLine3").attr("name","administrators["+administratorCount+"].postalAddress.addressLine3");
	$parent.find(".postalAddressLine4").attr("name","administrators["+administratorCount+"].postalAddress.addressLine4");
	$parent.find(".postalAddressPostCode").attr("name","administrators["+administratorCount+"].postalAddress.postCode");
	$parent.find(".postalAddressState").attr("name","administrators["+administratorCount+"].postalAddress.state");
	$parent.find(".postalAddressCity").attr("name","administrators["+administratorCount+"].postalAddress.city");
	$parent.find(".postalAddressCountry").attr("name","administrators["+administratorCount+"].postalAddress.country");
	
	$parent.find(".emailAddressOne").attr("name","administrators["+administratorCount+"].emailAddress[0].emailAddress");
	$parent.find(".emailAddressTwo").attr("name","administrators["+administratorCount+"].emailAddress[1].emailAddress");
	
	$parent.find(".phoneNumberOne").attr("name","administrators["+administratorCount+"].phoneNumbers[0].phoneNumber");
	$parent.find(".phoneNumberTwo").attr("name","administrators["+administratorCount+"].phoneNumbers[1].phoneNumber");
	
	$parent.find(".makePrimaryNumberOne").attr("name","administrators["+administratorCount+"].phoneNumbers[0].primaryPhoneNumber");
	$parent.find(".makePrimaryNumberTwo").attr("name","administrators["+administratorCount+"].phoneNumbers[1].primaryPhoneNumber");
	$parent.find(".makePrimaryEmailOne").attr("name","administrators["+administratorCount+"].phoneNumbers[0].primaryPhoneNumber");
	$parent.find(".makePrimaryEmailTwo").attr("name","administrators["+administratorCount+"].phoneNumbers[1].primaryPhoneNumber");
	
	*/
	
	/*$size=$html.length;
	$html=$html.first();
	$html.find(".administratorContactDetailsPersonalDetails").attr("href",$html.find(".administratorContactDetailsPersonalDetails").attr("href")+$size);
	$html.find(".administratorContactDetailsResidential").attr("href",$html.find(".administratorContactDetailsResidential").attr("href")+$size)
	$html.find(".administratorContactDetailsPostal").attr("href",$html.find(".administratorContactDetailsPostal").attr("href")+$size)
	$html.find(".administratorContactDetailsEmail").attr("href",$html.find(".administratorContactDetailsEmail").attr("href")+$size)
	$html.find(".administratorContactDetailsPhone").attr("href",$html.find(".administratorContactDetailsPhone").attr("href")+$size)
	
	
	$html.find("#administratorContactDetailsPersonalDetails").attr("id",$html.find("#administratorContactDetailsPersonalDetails").attr("id")+$size);
	$html.find("#administratorContactDetailsResidential").attr("id",$html.find("#administratorContactDetailsResidential").attr("id")+$size)
	$html.find("#administratorContactDetailsPostal").attr("id",$html.find("#administratorContactDetailsPostal").attr("id")+$size)
	$html.find("#administratorContactDetailsEmail").attr("id",$html.find("#administratorContactDetailsEmail").attr("id")+$size)
	$html.find("#administratorContactDetailsPhone").attr("id",$html.find("#administratorContactDetailsPhone").attr("id")+$size)
	*/
	
	/*$(".administratorsContainer").append($html);
	locations.push("");	
	
});*/

$(".editAdministrator").click(function(e) {
    edit=true;
	$(".addAdministrator").val("Edit Administrator");
	$(".administratorsContainer :input").prop("readonly",false);
});
$(".createAdministrator").click(function(e) {
	if(!administratorvalid){
		$(".error-alert").show();
		$("error-alert").find(".alert").text("Please add administrator");
		 return false;
	}
	var token = $("meta[name='_csrf']").attr("content");
	var header = $("meta[name='_csrf_header']").attr("content");
	//var transport array
	
	/*$.ajax({
		headers:{header:token},
		url:$(".createAdministratorForm").attr("action"),
		dataType:"json",
		type:"POST",
		data:{"administrators":JSON.stringify(JSONArray)},		
		beforeSend: function(){
			reveal("Creating new administrator please wait...");
		},
		success: function(responseText){
			/*console.log(responseText)
			window.parent.$(".close-reveal-modal").show();
		  	window.parent.$(".indicator").hide();
		  	window.parent.$(".note").text(responseText);
		  	$(".administratorsContainer :input").val("");	
			$(".administratorContactDetailsPersonalDetails").click();
		}
	}).done(function(){
			console.log(responseText)
			window.parent.$(".close-reveal-modal").show();
		  	window.parent.$(".indicator").hide();
		  	window.parent.$(".note").text(responseText);
		  	$(".administratorsContainer :input").val("");	
			$(".administratorContactDetailsPersonalDetails").click();
		});*/
		reveal("Creating new administrator please wait...");
		$.post($(".createAdministratorForm").attr("action"),{"administrators":JSON.stringify(JSONArray)},function(data){
			console.log(data)
			window.parent.$(".close-reveal-modal").show();
		  	window.parent.$(".indicator").hide();
		  	window.parent.$(".note").text(data);
		  	$(".administratorsContainer :input").val("");	
			$(".administratorContactDetailsPersonalDetails").click();
			$(".resetForm").click();

		});
});


/*$(document).on("click",".makePrimaryEmailOne",function(){
	if(primaryEmailState==0){
		$(".makePrimaryEmailOne").prop("checked",false);
		$(".makePrimaryEmailTwo").prop("checked",true);
		primaryEmailState=1
		primaryEmailState2=1
	}
	else{
		primaryEmailState=0;
		primaryEmailState2=0;
		$(".makePrimaryEmailOne").prop("checked",true);
		$(".makePrimaryEmailTwo").prop("checked",false);
	}
		
	});
	
	
$(document).on("click",".makePrimaryEmailTwo",function(){
	if(primaryEmailState2==0){
		$(".makePrimaryEmailTwo").prop("checked",true);
		$(".makePrimaryEmailOne").prop("checked",false);
		primaryEmailState2=1
		primaryEmailState=1
	}
	else{
		primaryEmailState2=0;
		primaryEmailState=0
		$(".makePrimaryEmailTwo").prop("checked",false);
		$(".makePrimaryEmailOne").prop("checked",true);
	}
		
	});	
	
	
	


$(document).on("click",".makePrimaryNumberOne",function(){
	if($(".makePrimaryNumberOne").prop("checked")){
		$(".makePrimaryNumberOne").prop("checked",false);
	}
	else{
		$(".makePrimaryNumberOne").prop("checked",true);
	}
	console.log($(".makePrimaryNumberOne").prop("checked"));
	if(primaryNumberState==0){
		$(".makePrimaryNumberOne").prop("checked",false);
		$(".makePrimaryNumberTwo").prop("checked",true);
		primaryNumberState=1
		primaryNumberState2=1
	}
	else{
		primaryNumberState=0;
		primaryNumberState2=0;
		$(".makePrimaryNumberOne").prop("checked",true);
		$(".makePrimaryNumberTwo").prop("checked",false);
	
		
	});

$(document).on("click",".makePrimaryNumberTwo",function(){
	if(primaryNumberState2==0){
		$(".makePrimaryNumberTwo").prop("checked",true);
		$(".makePrimaryNumberOne").prop("checked",false);
		primaryNumberState2=1
		primaryNumberState=1
	}
	else{
		primaryNumberState2=0;
		primaryNumberState=0
		$(".makePrimaryNumberTwo").prop("checked",false);
		$(".makePrimaryNumberOne").prop("checked",true);
	}
		
	});	*/
});