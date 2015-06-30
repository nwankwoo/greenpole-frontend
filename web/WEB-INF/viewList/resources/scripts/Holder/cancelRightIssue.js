var cancelRightIssue = angular.module("cancelRightIssue",[]);
cancelRightIssue.controller("cancelRightIssueController",function($scope){
	$scope.rights = [{'id' : '3','right' : 'APR Public Offer', 'clientCompany' : 'Africa Prudential Registrars' },{'id' : '4','right' : 'UBA Public Offer', 'clientCompany' : 'United Bank for Africa' }]
});

$(document).on("click",".cancelRightIssue",function(e) {
    $id = $(this).attr("data-id");
	
	var confirm_ = confirm('Are you sure want to cancel this ipo application');
	if(confirm_){
		reveal("Cancelling IPO please wait...");
		$.ajax({
			method : 'GET',
			url : 'CancelRightIssue/'+$id
		})
		.done(function(data){
			window.parent.$(".close-reveal-modal").show();
  			window.parent.$(".indicator").hide();
			if(data.responseCode===0){
				  window.parent.$(".note").text("Your request as been submitted for authorisation.");
			  }
			  else{
				  window.parent.$(".note").text(responseText.description);
			  }
  
			
		});
	}
});