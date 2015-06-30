var App=angular.module('addShareUnit',[]);

App.controller('addShareUnitCtrl',function($scope,$http){
	
	
	$scope.addShareUnit = function(){
		 var valid=true;
		 $(".queryShareholderAccountForm :input[type=text]").each(function(index, element) {
			 if($(this).attr("class")==="dateofbirth" && $(this).parent().css("display")==="none"){
				  return;
			 }
			 if( ($(this).val()==="") || ($(this).val()==="0") )
				valid=false;
        });
		$(".queryShareholderAccountForm :input[type=number]").each(function(index, element) {
			 
			 if( ($(this).val()==="") || ($(this).val()==="0") )
				valid=false;
        });
		$(".queryShareholderAccountForm select").each(function(index, element) {			
            if( ($(this).val()==="") || ($(this).val()==="0") )
				valid=false;
        });
		if(!valid){
			$(".error-alert").show();
			return;
		}
		$(".error-alert").hide();
		$(".descriptor").val(describe());
		showRequest();
		
		$.ajax({
			method : 'POST',
			url : $(".action").val()+"&mode="+$scope.getMode(),
			data : $(".addShareUnitForm").serialize(),
			header : {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.done(function(data){
			$scope.pageSize = 10;
			$scope.page = 1;
			$scope.isNew = true;
			if(data==="1"){
				$scope.response = "Query Successfull";
				$scope.getShareholderData();
			}
			else{
				$scope.response = "No record matches your search";
				showResponse($scope.response);
			}
			
			
			
		});
	}
	
	
	$scope.getShareholdersApplicationList=function(){
		$http.get("getShareholdersApplicationList?pageSize=ALL&page=ALL")
		.then(function(res){
			console.log(res);
			$scope._pageSize=$scope.pageSize;
			$scope.currentPage=$scope.page;	
			$scope.previousPage=$scope.currentPage-1;
			$scope.nextPage=$scope.currentPage+1;	
			$scope.shareholders = res.data[1];			
			shareholders=res.data;
			$scope.numberOfPages=res.data[0];
			$scope.totalPages=$scope.numberOfPages.length;
			$scope.totalRecord=res.data[2];	
			if($scope.totalPages>5 && $scope.currentPage>5){
				$scope.numberOfPages.splice(0,$scope.currentPage-5);
			}
			
		});
		
		if($scope.isNew){
			showResponse($scope.response);
		}
	}
	
	
	
});

function showRequest(formData, jqForm, options) { 
    reveal("Getting Shareholder list please wait...");
    return true; 
}

function showResponse(responseText, statusText, xhr, $form)  { 
  window.parent.$(".close-reveal-modal").show();
  window.parent.$(".indicator").hide();
  window.parent.$(".note").text(responseText);
 
  
} 