$(function(){
var options = {          
        beforeSubmit:  showRequest, 
        success:       showResponse 
 
    }; 
	$(".uploadShareUnitQuotationForm").ajaxForm(options);
	
$(".uploadShareUnitQuotationButton").click(function(e) {
	$(".error-alert").hide();
      var filePath=$(".shareUnitQuotationFile").val().trim();
	  var fileType=filePath.substr(filePath.lastIndexOf(".")+1,3).trim();
	  if(fileType!="csv" || fileType===""){
		  $(".error-alert").show();
		  return;
	  }
	  $(".uploadShareUnitQuotationForm").submit();
});

$(".resetForm").click(function(){
	$(".error-alert").hide();
	$("form")[0].reset();
});

});
function showRequest(formData, jqForm, options) { 
    reveal("Uploading share unit quotattion please wait...");
    return true; 
} 
 
function showResponse(responseText, statusText, xhr, $form)  { 
  window.parent.$(".close-reveal-modal").show();
  window.parent.$(".indicator").hide();
  window.parent.$(".note").text(responseText);
   if(responseText.responseCode===0){
	  window.parent.$(".note").text("Your request as been submitted for authorisation.");
   }
   else{
	   window.parent.$(".note").text(responseText.description);
   }
  $(".resetForm").click();
  
} 