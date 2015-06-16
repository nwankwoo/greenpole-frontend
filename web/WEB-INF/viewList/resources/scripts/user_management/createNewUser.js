
$(function(){
	$(document).ready(function(e) {
        $(".checked").click();
    });
		
	$(".createUserAccountNext").click(function(){
		var valid=true;
		$(".createNewUserForm :input[type=text],input[type=password],input[type=number],input[type=email]").each(function(index, element) {
			if($(this).attr("required")==undefined)
				return;
			
            if( ($(this).val()==="") || ($(this).val()==="0") ){
				valid=false;
			}
        });
		
		$(".createNewUserForm select").each(function(index, element) {
			if($(this).attr("required")==undefined)
				return;
			
            if( ($(this).val()==="")){
				valid=false;
			}
        });
		if(!valid){
			$(".error-alert").show();
			return;
		}
		$(".error-alert").hide();
		$(".title").html("Confirm New User Account");
		$(".main-form").hide();		
		$(".confirm-form").show();
	});
	$(".back").click(function(e) {
		$(".title").html("Create New User Account");
        $(".main-form").show();		
		$(".confirm-form").hide();
    });
	
	$(".showpassword").click(function(e) {
		if($(this).val()==="Show Password"){
			$(".default_password").hide();
			$("._password").show();
			$(this).val("Hide Password");
		}
		else{
			$(".default_password").show();
			$("._password").hide();
			$(this).val("Show Password");
		}
        
    });
	$(".clearform").click(function(e) {
		$(".checked").click();
		$(".checked").attr("checked","checked");
        $("form")[0].reset();		
    });
	
	var options = {};
            options.ui = {
                container: ".password",
                showStatus: true,
                showProgressBar: false,
                viewports: {
                    verdict: ".pwstrength_viewport_verdict",
                    status: ".pwstrength_viewport_verdict"
                }
            };
   $('#password').pwstrength(options);
   
   $("#password").keyup(function(e) {
		if($(".pwd_verdict").css("display")=="none"){
			$(".pwd_verdict").show();
		}
	});
	 var options = {          
        beforeSubmit:  showRequest, 
        success:       showResponse 
 
    }; 
	
	$(".createNewUserForm").ajaxForm(options);
	$(".createUserAccount").click(function(e) {
        $(".createNewUserForm").submit();
    });
	
	
	
});

function showRequest(formData, jqForm, options) { 
    reveal("Creating new user please wait...");
    return true; 
} 
 
function showResponse(responseText, statusText, xhr, $form)  { 
  window.parent.$(".close-reveal-modal").show();
  window.parent.$(".indicator").hide();
  window.parent.$(".note").text(responseText);
  $(".clearform").click();
  $(".pwd_verdict").hide();
  $(".back").click();
  
} 

var App=angular.module('MyApp',[]);
	
	App.controller('myController', function($scope,$http){
		$http.get("getDepartments")
			.then(function(res){
				$scope.departments=res.data;
				$scope.units=$scope.departments[0];
				console.log($scope.departments);
			});
		
		$scope.onChange=function(department_id){
			$scope.units=department_id.units;
		}
	});