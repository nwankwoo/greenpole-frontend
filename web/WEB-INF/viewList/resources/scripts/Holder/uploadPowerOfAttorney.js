var fileResponse="";
var uploadPowerofAttorneyApp=angular.module("uploadPowerofAttorneyApp",[]);

uploadPowerofAttorneyApp.controller("uploadPowerofAttorneyController",function($http,$scope){
	
});

$(".selectPowerofAttorneyFile").change(function(e) {
  	fileResponse = readURL(this,$(".PowerofAttorneyFile"));
});


var nowTemp = new Date();
		var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
		var openingDate = $('.startdate').fdatepicker({
					onRender: function (date) {
						return date.valueOf() < now.valueOf() ? 'disabled' : '';
					}
				}).on('changeDate', function (ev) {
					if (ev.date.valueOf() > closingDate.date.valueOf()) {
						var newDate = new Date(ev.date)
						newDate.setDate(newDate.getDate() + 1);
					}
				}).data('datepicker');
				
		var closingDate = $('.expirydate').fdatepicker({
					onRender: function (date) {
						return date.valueOf() <= openingDate.date.valueOf() ? 'disabled' : '';
					}
				}).on('changeDate', function (ev) {
				}).data('datepicker');


	
$(".uploadPowerofAttorneyButton").click(function(e) {
	$(".error-alert").hide();
	var valid=true;
		$(".uploadHolderPowerofAttorney :input[type=text]").each(function(index, element) {
			if($(this).attr("required")==undefined)
				return;
			
            if( ($(this).val()==="") || ($(this).val()==="0") ){
				valid=false;
			}
        });
		
		$(".uploadHolderPowerofAttorney select").each(function(index, element) {
			if($(this).attr("required")==undefined)
				return;
			
            if( ($(this).val()==="0")){
				valid=false;
			}
        });
		if(!valid){
			$(".error-alert").show();
			window.scroll(0,0);
			return;
		}
	console.log("poa="+$(".powerofattorneytype").val());	
    if(fileResponse==="file too large"){
		$(".error-alert").show();
		$(".msg").text("Selected image file is too large. Please select a PowerofAttorney file that is less than 2MB");
		window.scroll(0,0);
		return;
	}
	if(fileResponse===""){
		$(".error-alert").show();
		$(".msg").text("Please select power of attorney file.");
		window.scroll(0,0);
		return;
	}
	/*if($(".powerofattorneytype").val()=="0"){
		$(".error-alert").show();
		$(".msg").text("Please select power of attorney type.");
		window.scroll(0,0);
		return;
	}*/
	
	if($(".powerofattorneytype").val()=="Revocable"  && $(".expirydate").val()==""){
		$(".error-alert").show();
		$(".msg").text("Please enter end date.");
		window.scroll(0,0);
		return;
	}
	console.log("fileResponse="+fileResponse);
	$(".error-alert").hide();
	$(".title").html("Confirm Power of Attorney Details");
	$(".upload-PowerofAttorney").hide();
	$(".confirm-PowerofAttorney").show();
});

$(".uploadPowerofAttorneyResetButton").click(function(e) {
	$(".error-alert").hide();
    $("form")[0].reset();
});

$(".uploadPowerofAttorneyBackButton").click(function(e) {
    $(".upload-PowerofAttorney").show();
	$(".confirm-PowerofAttorney").hide();
});
$(".powerofattorneytype").change(function(){
	if($(this).val()=="Revocable"){
		$(".powerofattorneyexpiry").show();
		$(".expirydate").prop("required",true);
	}
	else{
		$(".powerofattorneyexpiry").hide();
		$(".expirydate").prop("required",false);
	}
	
	if($(this).val()!=="0"){
		$(".poahidden").val($(".powerofattorneytype option:selected").text());
		$(".poatype").text($(".powerofattorneytype option:selected").text());
	}
});
var options = {          
        beforeSubmit:  showRequest, 
        success:       showResponse 
 
    }; 


$(".uploadHolderPowerofAttorney").ajaxForm(options);
$(".confirmAndUploadPowerofAttorneyButton").click(function(e) {
    $(".uploadHolderPowerofAttorney").submit();
});

function showRequest(formData, jqForm, options) { 
    reveal("Uploading holder Power of Attorney please wait...");
    return true; 
} 

function showResponse(responseText, statusText, xhr, $form)  { 
  window.parent.$(".close-reveal-modal").show();
  window.parent.$(".indicator").hide();
  window.parent.$(".note").text(responseText);
  $(".uploadPowerofAttorneyResetButton").click();
  $(".uploadPowerofAttorneyBackButton").click();
  
} 