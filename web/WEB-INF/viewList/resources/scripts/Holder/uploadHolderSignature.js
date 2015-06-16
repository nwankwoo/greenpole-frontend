var fileResponse;
var uploadHolderSignatureApp=angular.module("uploadHolderSignatureApp",[]);

uploadHolderSignatureApp.controller("uploadHolderSignatureController",function($http,$scope){
	
});

$(".selectImageFile").change(function(e) {
  	fileResponse = readURL(this,$(".signatureImage"));
});


$(".uploadSignatureButton").click(function(e) {
	$(".error-alert").hide();
    if(fileResponse==="file too large"){
		$(".error-alert").show().css("width","40%");
		$(".msg").text("Selected image file is too large. Please select a signature file that is less than 2MB");
		return;
	}
	if(fileResponse===""){
		$(".error-alert").show();
		$(".msg").text("Please select image file.");
		return;
	}
	
	$(".upload-signature").hide();
	$(".confirm-signature").show();
});

$(".uploadSignatureResetButton").click(function(e) {
	$(".error-alert").hide();
    $("form")[0].reset();
});

$(".uploadSignatureBackButton").click(function(e) {
    $(".upload-signature").show();
	$(".confirm-signature").hide();
});

var options = {          
        beforeSubmit:  showRequest, 
        success:       showResponse 
 
    }; 


$(".uploadHolderSignature").ajaxForm(options);
$(".confirmAndUploadSignatureButton").click(function(e) {
    $(".uploadHolderSignature").submit();
});

function showRequest(formData, jqForm, options) { 
    reveal("Uploading holder signature please wait...");
    return true; 
} 

function showResponse(responseText, statusText, xhr, $form)  { 
console.log(responseText);
  window.parent.$(".close-reveal-modal").show();
  window.parent.$(".indicator").hide();
  window.parent.$(".note").text(responseText);
  $(".uploadSignatureResetButton").click();
  $(".uploadSignatureBackButton").click();
  
} 