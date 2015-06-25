var nowTemp = new Date();
		var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
		var openingDate = $('.openingDate').fdatepicker({
					onRender: function (date) {
						return date.valueOf() < now.valueOf() ? 'disabled' : '';
					}
				}).on('changeDate', function (ev) {
					if (ev.date.valueOf() > closingDate.date.valueOf()) {
						var newDate = new Date(ev.date)
						newDate.setDate(newDate.getDate() + 1);
					}
				}).data('datepicker');
				
		var closingDate = $('.closingDate').fdatepicker({
					onRender: function (date) {
						return date.valueOf() <= openingDate.date.valueOf() ? 'disabled' : '';
					}
				}).on('changeDate', function (ev) {
				}).data('datepicker');
				

var App=angular.module("setupInitialPublicOffer",[]);

App.controller("setupInitialPublicOfferController",function($scope,$http){
	$scope.offerDuration="";
	$scope.offerSize="";
	$scope.offerPrice=0;
	$scope.totalSharesOnOffer=0;
	$scope.orig = angular.copy($scope.data);
	$scope.calculateDateDiff=function(openingDate,closingDate){
		if( (typeof openingDate!==undefined) && (typeof closingDate!==undefined) ){
			
			openingDate=openingDate.split("/");
			closingDate=closingDate.split("/");
			var opening = new Date(openingDate[2],openingDate[1],openingDate[0]);
			var closing = new Date(closingDate[2],closingDate[1],closingDate[0]);
			
			var days=workingDaysBetweenDates(opening,closing);
			$scope.offerDuration=days +" working days";
		}
	}
	$scope.calculateOfferSize=function(offerPrice,totalSharesOnOffer){
		$scope.offerSize=offerPrice*totalSharesOnOffer;
	}
	$scope.reset=function(){
		$("form")[0].reset();
		$scope.offerDuration="";
		$scope.offerSize="";
		$scope.offerPrice=0;
		$scope.totalSharesOnOffer=0;
	}
});

App.directive('format',function($filter){
	'use strict';

        return {
            require: '?ngModel',
            link: function (scope, elem, attrs, ctrl) {
                if (!ctrl) {
                    return;
                }

                ctrl.$formatters.unshift(function () {
                    return $filter('number')(ctrl.$modelValue);
                });

                ctrl.$parsers.unshift(function (viewValue) {
                    var plainNumber = viewValue.replace(/[\,\.]/g, ''),
                        b = $filter('number')(plainNumber);

                    elem.val(b);

                    return plainNumber;
                });
            }
        };
});

$(".closingDate").change(function(e) {
    		var openingDate=$(".openingDate").val().split("/");
			var closingDate=$(".closingDate").val().split("/");
			console.log(openingDate);
			var opening = new Date(openingDate[2],openingDate[1],openingDate[0]);
			var closing = new Date(closingDate[2],closingDate[1],closingDate[0]);
			
			var days=workingDaysBetweenDates(opening,closing);
			$(".offerDuration").text(days +" working days");
});

$(".setupInitialPublicOfferButton").click(function(e) {
	var valid=true
	$(".error-alert").hide();
    $(".setupInitialPublicOfferForm :input[type=text],input[type=number]").each(function(index, element) {
			if($(this).attr("required")==undefined)
				return;
			
            if( ($(this).val()==="") || ($(this).val()==="0") || ($(this).val()==="0.0") || ($(this).val()==="0.00")){
				valid=false;
			}
        });
		
	if(!valid){
			$(".error-alert").show();
			return;
		}
	$(".confirm-field").show();
	$(".setupInitialPublicOffer").hide();
	$("#title").text("Setup Initial Public Offer");
});

$(".setupInitialPublicOfferBackButton").click(function(e) {
    $(".confirm-field").hide();
	$(".setupInitialPublicOffer").show();
	$("#title").text("Setup Initial Public Offer");
});
var options = {          
        beforeSubmit:  showRequest, 
        success:       showResponse 
 
    }; 
	
	$('.continuingMinimumSubscription').bind('keypress', function (event) {
		var regex = new RegExp("^[a-zA-Z0-9_.,& ]+$");
		var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
		if (!regex.test(key)) {
		   event.preventDefault();
		   return false;
		}
});
	 
	
	$(".setupInitialPublicOfferForm").ajaxForm(options);
$(".setupInitialPublicOfferConfirmButton").click(function(e) {
	$(".setupInitialPublicOfferForm :input[format]").each(function(index, element) {
		   	//$(this).prop("readonly",false);
			$(this).val(replaceAll(",","",$(this).val()));
			$(this).removeAttr("format");
    });
	$(".offerSize").val(replaceAll(",","",$(".offerSize").val()));
	//$(".setupInitialPublicOffer").show();
   $(".setupInitialPublicOfferForm").submit();
});


function showRequest(formData, jqForm, options) { 
    reveal("Setting up initial public offer please wait...");
    return true; 
} 

function showResponse(responseText, statusText, xhr, $form)  {
  window.parent.$(".close-reveal-modal").show();
  window.parent.$(".indicator").hide();
  if(responseText.responseCode===0){
	  window.parent.$(".note").text("Your request as been submitted for authorisation.");
	 $(".setupInitialPublicOfferResetButton").click();
	 $(".startingMinimumSubscription").attr("format","");
	  $(".continuingMinimumSubscription").attr("format","");
	  $(".offerPrice").attr("format","");
	  $(".totalSharesOnOffer").attr("format","");
  }
  else{
	  window.parent.$(".note").text(responseText.description);
  }
  
  $(".setupBondOfferBackButton").click();
  
} 
/* 
function showResponse(responseText, statusText, xhr, $form)  { 
$(".offerSize").prop("readonly",true);
  window.parent.$(".close-reveal-modal").show();
  window.parent.$(".indicator").hide();
  window.parent.$(".note").text(responseText);
  $(".setupInitialPublicOfferResetButton").click();
  $(".setupInitialPublicOfferBackButton").click();
  $(".startingMinimumSubscription").attr("format","");
  $(".continuingMinimumSubscription").attr("format","");
  $(".offerPrice").attr("format","");
  $(".totalSharesOnOffer").attr("format","");
} */


