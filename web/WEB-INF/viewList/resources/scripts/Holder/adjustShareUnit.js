var adjustShareUnit = angular.module("adjustShareUnit",[]);
adjustShareUnit.controller("adjustShareUnitController",function($scope){
	$scope.ipos = [{'id' : '3','ipo' : 'APR Public Offer', 'clientCompany' : 'Africa Prudential Registrars' },{'id' : '4','ipo' : 'UBA Public Offer', 'clientCompany' : 'United Bank for Africa' }]
});

$(document).on("click",".cancelIPO",function(e) {
    $id = $(this).attr("data-id");
	
	var confirm_ = confirm('Are you sure want to cancel this ipo application');
	if(confirm_){
		reveal("Cancelling IPO please wait...");
		$.ajax({
			method : 'GET',
			url : 'CancelIPO/'+$id
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