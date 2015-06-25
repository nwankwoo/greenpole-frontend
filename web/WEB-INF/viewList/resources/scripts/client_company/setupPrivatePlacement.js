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
						//closingDate.update(newDate);
					}
					//openingDate.hide();
					//$('.closingDate')[0].focus();
				}).data('datepicker');
				
		var closingDate = $('.closingDate').fdatepicker({
					onRender: function (date) {
						return date.valueOf() <= openingDate.date.valueOf() ? 'disabled' : '';
					}
				}).on('changeDate', function (ev) {
					//closingDate.hide();
				}).data('datepicker');
				

var App=angular.module("setupPrivatePlacement",[]);

App.controller("setupPrivatePlacementController",function($scope,$http){
	$scope.offerDuration="";
	$scope.offerSize="";
	$scope.offerPrice=0;
	$scope.totalSharesOnOffer=0;
	$scope.orig = angular.copy($scope.data);
	$scope.calculateDateDiff=function(openingDate,closingDate){
		if( (typeof openingDate!=="undefined") && (typeof closingDate!=="undefined") ){
			
			openingDate=openingDate.split("/");
			closingDate=closingDate.split("/");
			var opening = new Date(openingDate[2],openingDate[1],openingDate[0]);
			var closing = new Date(closingDate[2],closingDate[1],closingDate[0]);
			
			var days=workingDaysBetweenDates(opening,closing);
			$scope.offerDuration=days +" working days";
		}
	}
	$scope.calculateOfferSize=function(offerPrice,totalSharesOnOffer){
		console.log(offerPrice+" "+totalSharesOnOffer);
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


$(".setupPrivatePlacementButton").click(function(e) {
	var valid=true
	$(".error-alert").hide();
    $(".setupPrivatePlacementForm :input[type=text],input[type=number]").each(function(index, element) {
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
	$(".setupPrivatePlacement").hide();
	$("#title").text("Setup Private Placement");
});

$(".setupPrivatePlacementBackButton").click(function(e) {
    $(".confirm-field").hide();
	$(".setupPrivatePlacement").show();
	$("#title").text("Setup Private Placement");
});
var options = {          
        beforeSubmit:  showRequest, 
        success:       showResponse 
 
    }; 
	
	$(".setupPrivatePlacementForm").ajaxForm(options);
$(".setupPrivatePlacementConfirmButton").click(function(e) {
	$(".setupPrivatePlacementForm :input[format]").each(function(index, element) {
			$(this).val(replaceAll(",","",$(this).val()));
			$(this).removeAttr("format");
    });
	$(".offerSize").val(replaceAll(",","",$(".offerSize").val()));
	//$(".setupPrivatePlacement").show();
   $(".setupPrivatePlacementForm").submit();
});


function showRequest(formData, jqForm, options) { 
    reveal("Setting up private placement please wait...");
    return true; 
} 
 
function showResponse(responseText, statusText, xhr, $form)  { 
$(".offerSize").prop("readonly",true);
  window.parent.$(".close-reveal-modal").show();
  window.parent.$(".indicator").hide();
  window.parent.$(".note").text(responseText);
  if(responseText.responseCode===0){
	  window.parent.$(".note").text("Your request as been submitted for authorisation.");
  $(".setupPrivatePlacementResetButton").click();
 
  $(".startingMinimumSubscription").attr("format","");
  $(".continuingMinimumSubscription").attr("format","");
  $(".offerPrice").attr("format","");
  $(".totalSharesOnOffer").attr("format","");
  }
   else{
	  window.parent.$(".note").text(responseText.description);
  }
   $(".setupPrivatePlacementBackButton").click();
} 


