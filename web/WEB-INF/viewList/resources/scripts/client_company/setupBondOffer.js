var App=angular.module('setupBondOfferApp',[]);
var selected=[];

App.controller('setupBondOfferController',function($scope,$http){
	$scope.bondTypes=[{"id" : "0" , "type" : "Select Bond Type"},{"id" : "2" , "type" : "Fixed Bond"},{"id" : "1" , "type" : "Redeemable Bond"}];
	
	$scope.paymentPlans=[{"id" : "1" , "plan" : "None"},{"id" : "2" , "plan" : "Quarterly"},{"id" : "3" , "plan" : "Semi Annually"}];
	$scope.selectedPaymentPlan="";
	$scope.selectedPaymentPlanId="";
	$scope.selectedBondType="";
	$scope.bondTypeChange=function(bondType){
		$(".paymentPlan").prop("disabled",true);
		$(".paymentPlan").prop("required",false);
		$scope.selectedBondType=bondType.type;
		$(".selectedBondType").val(bondType.id);
		$(".selectedBondTypeName").val(bondType.type);
		$(".selectedPaymentPlan").val("1");
		if(bondType.type==="Redeemable Bond"){
			$(".paymentPlan").prop("disabled",false);
			$(".paymentPlan").prop("required",true);
		}
		$scope.paymentPlan=$scope.paymentPlans[0];
	}
	
	$scope.paymentPlanChange=function(paymentPlan){
		
		$scope.selectedPaymentPlanId=paymentPlan.id!=0 ? paymentPlan.id:"";
		$(".selectedPaymentPlan").val($scope.selectedPaymentPlanId);
		$(".selectedPaymentPlanName").val(paymentPlan.plan);
	}
});


$(".setupBondOfferButton").click(function(){
	var valid=true;
	$(".error-alert").hide();
		$(".setupBondOfferForm :input[type=text],input[type=password],input[type=number],input[type=email]").each(function(index, element) {
			if($(this).attr("required")==undefined)
				return;
			
            if( ($(this).val()==="") || ($(this).val()==="0") ){
				valid=false;
			}
        });
		
		$(".setupBondOfferForm select").each(function(index, element) {
			if($(this).attr("required")==undefined)
				return;
			
            if( ($(this).val()==="") || ($(this).val()==="0") ){
				valid=false;
			}
        });
		
		if(!valid){
			$(".error-alert").show();
			//$(".companyName").focus();
			return;
		}
		$(".confirm-field").show();
		$(".setupBondOffer").hide();
		$(".title").text("Confirm Bond Offer Setup");
});

$(".setupBondOfferBackButton").click(function(e) {
	$(".title").text("Setup Bond Offer");
    $(".confirm-field").hide();
	$(".setupBondOffer").show();
});

$(".setupBondOfferResetButton").click(function(e) {
     $("form")[0].reset();	
});

 var options = {          
        beforeSubmit:  showRequest, 
        success:       showResponse 
 
    }; 
	
	$(".setupBondOfferForm").ajaxForm(options);
$(".confirmSetupBondOfferButton").click(function(e) {
    $(".setupBondOfferForm").submit();
});


function showRequest(formData, jqForm, options) { 
    reveal("Setting up bond offer please wait...");
    return true; 
} 
 
 function showResponse(responseText, statusText, xhr, $form)  { 
  window.parent.$(".close-reveal-modal").show();
  window.parent.$(".indicator").hide();
  if(responseText.responseCode===0){
	  window.parent.$(".note").text("Your request as been submitted for authorisation.");
	 $(".setupBondOfferResetButton").click();
  }
  else{
	  window.parent.$(".note").text(responseText.description);
  }
  
  $(".setupBondOfferBackButton").click();
  
} 
/*
function showResponse(responseText, statusText, xhr, $form)  { 
  window.parent.$(".close-reveal-modal").show();
  window.parent.$(".indicator").hide();
  window.parent.$(".note").text(responseText);
  $(".setupBondOfferResetButton").click();
  $(".setupBondOfferBackButton").click();
  
} */
