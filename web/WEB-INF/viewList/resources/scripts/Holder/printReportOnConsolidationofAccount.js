
var App=angular.module('viewReportonAccountConsolidation',[]);
App.controller('viewReportonAccountConsolidationCtrl',function($scope,$http){
	
	
	$scope.getConsolidation=function(){
		$http.get("getConsolidation?pageSize=ALL&page=ALL")
		.then(function(res){
			console.log(res);
			$scope._pageSize=$scope.pageSize;
			$scope.currentPage=$scope.page;	
			$scope.previousPage=$scope.currentPage-1;
			$scope.nextPage=$scope.currentPage+1;	
			$scope.consolidations = res.data[1];	
			$scope.numberOfPages=res.data[0];
			$scope.totalPages=$scope.numberOfPages.length;
			$scope.totalRecord=res.data[2];	
			if($scope.totalPages>5 && $scope.currentPage>5){
				$scope.numberOfPages.splice(0,$scope.currentPage-5);
			}
			
		});
		
		/*if($scope.isNew){
			showResponse($scope.response);
		}*/
	}
	
	$scope.getConsolidation();
});