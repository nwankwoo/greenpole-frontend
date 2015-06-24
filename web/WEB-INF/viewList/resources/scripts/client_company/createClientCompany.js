//var App=

angular.module("createNewClientCompany",[],function($compileProvider){
	$compileProvider.directive('addAddress', function($compile){
		return function(scope, element, attrs){
			
		};
	});
}).controller("createNewClientCompanyController",['$scope' ,function($scope){
	$scope.companyName="";
	$scope.companyCode="";
	$scope.companyCEOName="";
	$scope.companyAddress="";
	$scope.companyPhoneNumber="";
	$scope.companyEmailAddress="";
	$scope.companyDepository="";
	$scope.streetAddress=[];
	$scope.city=[];
	$scope.state=[];
	$scope.depositoriesDefault="Select Depository";
	$scope.depositoriesDefaultId="";
	$scope.NSESectorID="";
	$scope.depositoriesDepositoryName="";
	$scope.depositories=[{"id":"0","name":"0","fullname":"Select Depository"},{"id":"1","name":"CSCS","fullname":"Central Security Clearing System"},
			{"id":"2","name":"NASD","fullname":"NASD"}];
	
	$scope.nsesectors=[{"id":"0","name":"Select NSE Sector"},{"id":"1","name":"Banking"},{"id":"2","name":"Construction"},{"id":"2","name":"Registrars"}];
	
	$scope.onChangeDepository=function(id){
			$scope.depositoriesDefaultId=id.id;
			$scope.depositoriesDepositoryName=id.fullname;
		}
		
		$scope.onChangeNSESector=function(id){
			$scope.NSESectorID = id.id;
			$scope.NSESectorName = id.name;
		}
	
}]);


$(function(){
	var regionalSettings;
	var state;
	$.ajax({
			method : 'GET',
			url : 'getRegionalSettings'
		})
		.done(function(data){
			regionalSettings = data;
			loadUpCountries(data);
			//console.log(data);
		});
		
		function loadUpCountries(data){
			var countrySelect = '<select name="addresses[0].country" class="countryList">';
			$.each(data,function(i,v){
				countrySelect+='<option value="'+v.name+'">'+v.name+'</option>';
			});
			countrySelect+='</select>';
			$(".countrySpan").html(countrySelect);
		}
	
	var nowTemp = new Date();
var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
$('.dateofincorporation').fdatepicker({
					onRender: function (date) {
						return date.valueOf() < now.valueOf() ? '' : 'disabled';
					}
				})
				
	$(document).on("change",".countryList",function(){
		$(".confirmCountry").eq($(".countryList").index($(this))).html($(this).val());
		$name = $(this).val();
		$.each(regionalSettings,function(i,v){
			if(v.name === $name){
				state = v.state;
			}
		});
		//state = regionalSettings[$(this).val()].state;
		if(state.length<=1){
			$(".confirmState").eq($(".stateList").index($(this))).html(state[0].name);
		}
		loadUpState(state);
	});
	
	function loadUpState(data){
		var stateSelect = '<select name="addresses[0].state" class="stateList">';
			$.each(data,function(i,v){
				stateSelect+='<option value="'+v.name+'">'+v.name+'</option>';
			});
			stateSelect+='</select>';
			$(".stateSpan").html(stateSelect);
	}
	
	$(document).on("change",".stateList",function(){
		$(".confirmState").eq($(".stateList").index($(this))).html($(this).val());
	});
		
	$(".addAddress").click(function(e) {
		$html=$(".addressDetails").clone().first();
		$index=$(".addressDetails").clone().length+1;
		$html.find(".addressLabelNumber").html("Address "+($index));
		$html.find(".removeAddressBlock").css("display","block");
		
		$html.find(".makePrimary").attr("name","addresses["+($index-1)+"].primaryAddress").attr("id","addresses"+($index-1)+".primaryAddress").prop("checked",false);
		$html.find(".addressLineOne").attr("name","addresses["+($index-1)+"].addressLine1").attr("id","addresses"+($index-1)+".addressLine1");
		$html.find(".addressLineTwo").attr("name","addresses["+($index-1)+"].addressLine2").attr("id","addresses"+($index-1)+".addressLine2");
		$html.find(".addressLineThree").attr("name","addresses["+($index-1)+"].addressLine3").attr("id","addresses"+($index-1)+".addressLine3");
		$html.find(".addressLineFour").attr("name","addresses["+($index-1)+"].addressLine3").attr("id","addresses"+($index-1)+".addressLine4");
		$html.find(".postCode").attr("name","addresses["+($index-1)+"].postCode").attr("id","address"+($index-1)+".postCode");
		$html.find(".city").attr("name","addresses["+($index-1)+"].city").attr("id","addresses"+($index-1)+".city");
		$html.find(".state").attr("name","addresses["+($index-1)+"].state").attr("id","addresses"+($index-1)+".state");
		$html.find(".country").attr("name","addresses["+($index-1)+"].country").attr("id","addresses"+($index-1)+".country");
		
		$html.appendTo(".addressFieldSet").find("input:text").val("");
		
		
		
		$html_=$(".confirmAddressDetails").clone().first(); 
		$html_.find(".confirmAddressLabelNumber").html("Address "+($index));
		$html_.appendTo(".confirmAddressFieldSet").find(".confirm").html("&nbsp;").find(".addressTypeConfirm").html("&nbsp;");
    });
	
	$(document).on("click",".makePrimary",function(){
		$index=$(".makePrimary").index($(this));
		if($(this).prop("checked")){
			$(".makePrimary").prop("checked",false);
			$(this).prop("checked",true);
			
			$(".confirmMakePrimary").prop("checked",false);
			$(".confirmMakePrimary").eq($index).prop("checked",true);
		}
		
	});
	
	$(document).on("click",".makePrimaryNumber",function(){
		$index=$(".makePrimaryNumber").index($(this));
		if($(this).prop("checked")){
			$(".makePrimaryNumber").prop("checked",false);
			$(this).prop("checked",true);
			
			$(".confirmmakePrimaryNumber").prop("checked",false);
			$(".confirmmakePrimaryNumber").eq($index).prop("checked",true);
		}
		
	});
	
	$(document).on("click",".removeAddressBlock",function(){
		$index=$(".removeAddressBlock").index($(this));
		$(".addressDetails").eq($index).remove();
		$(".confirmAddressDetails").eq($index).remove();
	});
	
	$(".createClientCompanyButton").click(function(){
		var valid=true;
		$(".createClientCompany :input[type=text],input[type=password],input[type=number],input[type=email]").each(function(index, element) {
			if($(this).attr("required")==undefined)
				return;
			
            if( ($(this).val()==="") || ($(this).val()==="0") ){
				valid=false;
			}
        });
		
		$(".createClientCompany select").each(function(index, element) {
			if($(this).attr("required")==undefined)
				return;
			
            if( ($(this).val()==="") || ($(this).val()==="0") ){
				valid=false;
			}
        });
		
		$(".createClientCompany input[type=email]").each(function(index, element) {
			if($(this).attr("required")==undefined)
				return;
			var emailexpression=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
			var regex = new RegExp(emailexpression);
            if(!regex.test($(this).val()) ){
				
				valid=false;
			}
        });
		
		if(!valid){
			$(".error-alert").show();
			$(".companyName").focus();
			return;
		}
		
		$(".enterClientCompanyDiv").hide();
		$("#title").text("Confirm Client Company Creation");
		$(".cofirm-detailDiv").show();
	});
	
	$(".back").click(function() {
        $(".enterClientCompanyDiv").show();
		$("#title").text("Create New Client Company");
		$(".cofirm-detailDiv").hide();
    });
	
	/*
	$(document).on("keyup",".addressType",function(){
		$index=$(".addressType").index($(this));
		$(".addressTypeConfirm").eq($index).text($(this).val());
	});
	
	$(".addEmailAddress").click(function(e) {
		$html=$(".EmailAddressRow").clone().first();
		$html.find(".EmailAddress").attr("name","emailAddress["+$(".EmailAddressRow").clone().length+"]")
			.attr("id","emailAddress"+$(".EmailAddressRow").clone().length);
        $html.appendTo(".emailRow").find(".addressTitle").last().html("Email Address "+$(".EmailAddressRow").clone().length);
    });
	
	$(".addPhoneNumber").click(function(e) {
		$html=$(".phoneNumberRow").clone().first();
		$html.find(".phoneNumber").attr("name","phoneNumber["+$(".phoneNumberRow").clone().length+"]")
			.attr("id","streetAddress"+$(".phoneNumberRow").clone().length);
        $html.appendTo(".phoneRow").find(".addressTitle").last().html("Phone Number "+$(".phoneNumberRow").clone().length);
    });*/
	
	$(document).on("keyup",".addressLineOne",function(){
		var index=$(".addressLineOne").index($(this));
		$destination=$(".confirmAddressLineOne").eq(index);
		$content=$(this).val();
		paint($destination,$content);
	});
	
	$(document).on("keyup",".addressLineTwo",function(){
		var index=$(".addressLineTwo").index($(this));
		$destination=$(".confirmAddressLineTwo").eq(index);
		$content=$(this).val();
		paint($destination,$content);
	});
	
	$(document).on("keyup",".addressLineThree",function(){
		var index=$(".addressLineThree").index($(this));
		$destination=$(".confirmAddressLineThree").eq(index);
		$content=$(this).val();
		paint($destination,$content);
	});
	
	$(document).on("keyup",".addressLineFour",function(){
		var index=$(".addressLineFour").index($(this));
		$destination=$(".confirmAddressLineFour").eq(index);
		$content=$(this).val();
		paint($destination,$content);
	});
	
	$(document).on("keyup",".postCode",function(){
		var index=$(".postCode").index($(this));
		$destination=$(".confirmPostCode").eq(index);
		$content=$(this).val();
		paint($destination,$content);
	});
	
	$(document).on("keyup",".city",function(){
		var index=$(".city").index($(this));
		$destination=$(".confirmCity").eq(index);
		$content=$(this).val();
		paint($destination,$content);
	});
	
	$(document).on("keyup",".state",function(){
		var index=$(".state").index($(this));
		$destination=$(".confirmState").eq(index);
		$content=$(this).val();
		paint($destination,$content);
	});
	
	$(document).on("keyup",".country",function(){
		var index=$(".country").index($(this));
		$destination=$(".confirmCountry").eq(index);
		$content=$(this).val();
		paint($destination,$content);
	});
	
	 var options = {          
        beforeSubmit:  showRequest, 
        success:       showResponse 
 
    }; 
	
	$(".createClientCompany").ajaxForm(options);
	$(".createNewClientCompanyButton").click(function(e) {
        $(".createClientCompany").submit();
    });
	
	
	$(".clearform").click(function(e) {
		$(".makePrimary").eq(0).prop("checked",true);
		$(".addressDetails").each(function(index, element) {
            if(index>0){
				$(this).remove();
				$(".confirmAddressDetails").eq(index).remove();
			}
        });
        $("form")[0].reset();		
		$(".companyName").focus();
    });
	
});

function showRequest(formData, jqForm, options) { 
    reveal("Creating new client company please wait...");
    return true; 
} 
 
function showResponse(responseText, statusText, xhr, $form)  { 
  window.parent.$(".close-reveal-modal").show();
  window.parent.$(".indicator").hide();
  if(responseText.responseCode===0){
	  window.parent.$(".note").text("Your request as been submitted for authorisation.");
	  $(".clearform").click();
  }
  else{
	  window.parent.$(".note").text(responseText.description);
  }
  
  $(".back").click();
  
} 

function paint($destination,$content){
	$destination.html($content);
}