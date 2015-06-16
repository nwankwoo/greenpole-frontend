$(document).ready(function(e) {
   $(".femaleRadio").click(); 
});

var createBondholderApp = angular.module("createBondholderApp",[]);

createBondholderApp.controller("createBondholderController",function($scope,$http){
	$scope.holderTypes=[{id:"0",type:"Select Bondholder Type"},{id:"1",type:"Individual"},{id:"2",type:"Corporate"}];
	$scope.stockbrokers=[{id:"0",name:"Select Stockbroker"},{id:"1",name:"Cash Craft Limited"},{id:"2",name:"Mutual Trust"}];
	$scope.clientCompanies=[{id:"0",name:"Select Client Company"},{id:"2",name:"Africa Prudential Registrars"}];
	
	$scope.bondOffers=[{id:"0",name:"Select Bond Offer"},{id:"1",name:"APR Bond Offer"}];
	
	
	
});

var nowTemp = new Date();
var _back =(nowTemp.getFullYear()-18);
var now = new Date(_back, nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
$('.dateofbirth').fdatepicker({
					onRender: function (date) {
						return date.valueOf() < now.valueOf() ? '' : 'disabled';
					}
				})
				
$(document).on("click",".makePrimary",function(){
		$index=$(".makePrimary").index($(this));
		if($(this).prop("checked")){
			$(".makePrimary").prop("checked",false);
			$(this).prop("checked",true);
			
			$(".confirmMakePrimary").prop("checked",false);
			$(".confirmMakePrimary").eq($index).prop("checked",true);
		}
		
	});

$(document).ready(function(e) {
    $(".genderField").val("Female");
});
$(".gender").click(function(){
	if($(this).is(":checked")){
		$(".genderField").val($(this).val());
		
	}
});
	
$(".createBondholderAccount").click(function(e) {
	$(".error-alert").hide();
    var valid=true;
		$(".createBondholderForm :input[type=text],input[type=password],input[type=number],input[type=email]").each(function(index, element) {
			if($(this).attr("required")==undefined)
				return;
			
            if( ($(this).val()==="") || ($(this).val()==="0") ){
				valid=false;
			}
        });
		
		$(".createBondholderForm select").each(function(index, element) {
			if($(this).attr("required")==undefined)
				return;
			
            if( ($(this).val()==="") || ($(this).val()==="0") ){
				valid=false;
			}
        });
		
		if(!valid){
			$(".error-alert").show();
			return;
		}
		$(".createBondholderDiv").hide();
		$("#title").text("Confirm Bondholder Account Details");
		$(".confirm-details").show();
		window.scrollTo(0,0);
});

$(".createBondholderAccountBack").click(function(e) {
	$("#title").text("Create Bondholder Account");
    $(".createBondholderDiv").show();
	$(".confirm-details").hide();
});

$(".residential").click(function(e) {
    $(".primaryAddress").val("residential");
	$(".postalAddressDetails :input[type=text],input[type=password],input[type=number],input[type=email]").each(function(index, element) {
		console.log($(this).html());
        if($(this).prop("required"))
			$(this).prop("required",false)
    });
	$(".postalAddressDetails small.required").each(function(index, element) {
       $(this).css("color" ,"#fff");
    });
	
	$(".addressDetails :input[type=text],input[type=password],input[type=number],input[type=email]").each(function(index, element) {
		
        if(!$(this).prop("required"))
			$(this).prop("required",true)
    });
	
	$(".addressDetails small.required").each(function(index, element) {
       $(this).css("color" ,"red");
    });
	$(".addressLineTwo .addressLineThree .addressLineFour .postCode").prop("required",false);
});

$(".postal").click(function(e) {
    $(".primaryAddress").val("postal");
	$(".addressDetails :input[type=text],input[type=password],input[type=number],input[type=email]").each(function(index, element) {
		
        if($(this).prop("required"))
			$(this).prop("required",false)
    });
	
	$(".addressDetails small.required").each(function(index, element) {
       $(this).css("color" ,"#fff");
    });
	
	$(".postalAddressDetails :input[type=text],input[type=password],input[type=number],input[type=email]").each(function(index, element) {
		
        if(!$(this).prop("required"))
			$(this).prop("required",true)
    });
	
	$(".postalAddressDetails small.required").each(function(index, element) {
       $(this).css("color" ,"red");
    });
	
	$(".postalAddressLineTwo, .postalAddressLineThree, .postalAddressLineFour, .postCode").prop("required",false);
});
var options = {          
        beforeSubmit:  showRequest, 
        success:       showResponse 
 
    }; 
$(".createBondholderForm").ajaxForm(options);
	$(".submitBondholder").click(function(e) {
        $(".createBondholderForm").submit();
    });

function showRequest(formData, jqForm, options) { 
    reveal("Creating new bondholder account please wait...");
    return true; 
} 

$(document).on("click",".makePrimaryNumber",function(){
		$index=$(".makePrimaryNumber").index($(this));
		if($(this).prop("checked")){
			$(".makePrimaryNumber").prop("checked",false);
			$(this).prop("checked",true);
			
			$(".phoneNumber").prop("required",false);
			$(".phoneNumber").eq($index).prop("required",true);
			
			$(".confirmmakePrimaryNumber").prop("checked",false);
			$(".confirmmakePrimaryNumber").eq($index).prop("checked",true);
		}
		
	});

$(document).on("click",".makePrimaryEmail",function(){
		$index=$(".makePrimaryNumber").index($(this));
		if($(this).prop("checked")){
			$(".makePrimaryEmail").prop("checked",false);
			$(this).prop("checked",true);
			//$(this).parent().parent().find(".email").prop("required",true);
			
			$(".email").prop("required",false);
			$(".email").eq($index).prop("required",true);
			
			$(".confirmmakePrimaryEmail").prop("checked",false);
			$(".confirmmakePrimaryEmail").eq($index).prop("checked",true);
		}
		
	});
	$(".createBondholderAccountReset").click(function(e) {
        $("form")[0].reset();
		window.scroll(0,0);
    });
 
function showResponse(responseText, statusText, xhr, $form)  { 
  window.parent.$(".close-reveal-modal").show();
  window.parent.$(".indicator").hide();
  window.parent.$(".note").text(responseText);
  $(".createBondholderAccountReset").click();
  $(".createBondholderAccountBack").click();
  
} 