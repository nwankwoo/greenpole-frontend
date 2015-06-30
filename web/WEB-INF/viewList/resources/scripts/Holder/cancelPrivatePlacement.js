var cancelPrivatePlacement = angular.module("cancelPrivatePlacement",[]);
cancelPrivatePlacement.controller("cancelPrivatePlacementController",function($scope){
	$scope.privatePlacements = [{'id' : '3','PrivatePlacement' : 'APR Public Offer', 'clientCompany' : 'Africa Prudential Registrars' },{'id' : '4','PrivatePlacement' : 'UBA Public Offer', 'clientCompany' : 'United Bank for Africa' }]
});

$(document).on("click",".cancelPrivatePlacement",function(e) {
    $id = $(this).attr("data-id");
	
	var confirm_ = confirm('Are you sure want to cancel this Private Placement application');
	if(confirm_){
		reveal("Cancelling Private Placement please wait...");
		$.ajax({
			method : 'GET',
			url : 'CancelPrivatePlacement/'+$id
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