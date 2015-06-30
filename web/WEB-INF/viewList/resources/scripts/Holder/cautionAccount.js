var cautionAccount = angular.module("cautionAccount",[]);
cautionAccount.controller("cautionAccountController",function($scope){
	
});


$(function(){
	$(".cautionAccountButton").click(function(e) {
		$(".notification").hide();
		var valid = true;
        $(".confirmCautionSetupForm input[type=text],input[type=password],input[type=number],input[type=email]").each(function(index, element) {
            if($(this).attr("required")==undefined)
				return;
			
            if( ($(this).val()==="") || ($(this).val()==="0") ){
				valid=false;
			}
        });
		
		$(".confirmCautionSetupForm select").each(function(index, element) {
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
		
			$(".cautionDiv").hide();
			$(".confirmCautionSetup").show();
		
    });//end of cautionAccountButton
	
	$(".cautionAccountBack").click(function(e) {
        $(".cautionDiv").show();
		$(".confirmCautionSetup").hide();
    });
	
	$(".resetForm").click(function(e) {
        $(".confirmCautionSetupForm input[type=text],input[type=password],input[type=number],input[type=email], textarea").val('');
		window.scroll(0,0);
    });
	
	var options = {          
        beforeSubmit:  showRequest, 
        success:       showResponse 
 
    };
	$(".confirmCautionSetupForm").ajaxForm(options);
	$(".cautionAccountSaveAndContinue").click(function(e) {
        $(".confirmCautionSetupForm").submit();
    });
	
	$(".cautionType").change(function(e) {
        if($(this).val()==='Normal'){
			$(".cautionReason").show();
			$(".reason").prop("required",true);
		}else{
			$(".cautionReason").hide();
			$(".reason").prop("required",false);
		}
    });
	
})

function showRequest(formData, jqForm, options) { 
    reveal("Applying Caution please wait...");
    return true; 
}

function showResponse(responseText, statusText, xhr, $form)  { 
  window.parent.$(".close-reveal-modal").show();
  window.parent.$(".indicator").hide();
  window.parent.$(".note").text(responseText);
  if(responseText.responseCode===0){
	  window.parent.$(".note").text("Your request as been submitted for authorisation.");
	  $(".resetForm").click();
  }
  else{
	  window.parent.$(".note").text(responseText.description);
  }
  $(".cautionAccountBack").click();
  
} 