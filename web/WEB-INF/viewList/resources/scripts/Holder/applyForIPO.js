var applyForIPO = angular.module("applyForIPO",[]);
applyForIPO.controller("applyForIPOController",function($scope){
	
	$scope.issuers = [{"id" : "0" , "name" : "Select Issuer"},{"id" : "1" , "name" : "Africa Prudential Registrars"}, {"id" : "2" , "name" : "United Bank of Africa"}, {"id" : "3" , "name" : "United Capitals"}];
	
	$scope.issuingHouses = [{"id" : "0" , "name" : "Select Issuing"},{"id" : "1" , "name" : "Cash Craft"}, {"id" : "2" , "name" : "Mutual Trust"}, {"id" : "3" , "name" : "General Stockbrockers"}];
});


$(function(){
	$(".applyForIPOButton").click(function(e) {
		$(".notification").hide();
		var valid = true;
        $(".applyForIPOForm input[type=text],input[type=password],input[type=number],input[type=email]").each(function(index, element) {
            if($(this).attr("required")==undefined)
				return;
			
            if( ($(this).val()==="") || ($(this).val()==="0") ){
				valid=false;
			}
        });
		
		$(".applyForIPOForm select").each(function(index, element) {
			if($(this).attr("required")==undefined)
				return;
			
            if( ($(this).val()==="") || ($(this).val()==="0") ){
				valid=false;
			}
        });
		
		if(!valid){
			$(".notification").show();
			return;
		}
		
			$(".ipoDiv").hide();
			$(".confirmIPOSetup").show();
		
    });//end of applyForIPOButton
	
	$(".applyForIPOBack").click(function(e) {
        $(".ipoDiv").show();
		$(".confirmIPOSetup").hide();
    });
	
	$(".resetForm").click(function(e) {
        $(".applyForIPOForm input[type=text],input[type=password],input[type=number],input[type=email]").val('');
		window.scroll(0,0);
    });
	
	var options = {          
        beforeSubmit:  showRequest, 
        success:       showResponse 
 
    };
	$(".applyForIPOForm").ajaxForm(options);
	$(".applyForIPOSaveAndContinue").click(function(e) {
        $(".applyForIPOForm").submit();
    });
	
})

function showRequest(formData, jqForm, options) { 
    reveal("Applying for IPO please wait...");
    return true; 
}

function showResponse(responseText, statusText, xhr, $form)  { 
  window.parent.$(".close-reveal-modal").show();
  window.parent.$(".indicator").hide();
  window.parent.$(".note").text(responseText);
  if(responseText.responseCode===0){
	  window.parent.$(".note").text("Your request as been submitted for authorisation.");
	  $(".createBondholderAccountReset").click();
  }
  else{
	  window.parent.$(".note").text(responseText.description);
  }
  $(".createBondholderAccountBack").click();
  
} 