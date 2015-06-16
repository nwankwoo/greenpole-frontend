var App=angular.module('QueryShareholderAccountApp',[]);
var selected=[];
var shareholders=[];
var shareholderList=[];
App.controller('queryShareholderAccountCtrl',function($scope,$http){
	$scope.shareholderList=[];
	
	
	
	$scope.pageSize=1;
	$scope.page=1;
	$scope.holder={};
	$scope.shareholders={};
	$scope.subholders={};
	$scope.pages=[];
	$scope.dataSize=1;
	$scope.calls =0;
	$scope.getShareholderData=function(){
		$http.get("getShareholders?pageSize=ALL&page=ALL")
		.then(function(res){
			$scope.currentPage=$scope.page;	
			$scope.previousPage=$scope.currentPage-1;
			$scope.nextPage=$scope.currentPage+1;
			$scope.shareholders = res.data[1];
			$scope.dataSize = $scope.shareholders.length
			$scope.pageSize =$scope.dataSize / 10;
			console.log($scope.shareholders);
			
			$scope.pageSize = $scope.dataSize / 10;
			for(var i=1;i<=$scope.pageSize;i++){
				$scope.pages.push(i);
			}
			
		});
	}
	
	$scope.holder.holdings=function(shareholder){
		$scope.totalHoldings=0;
		angular.forEach(shareholder.companyAccounts,function(account){
			$scope.totalHoldings+=account.shareUnits;
		});
		return $scope.totalHoldings;
	}
	
	$scope.subholders = function chunk(size) {
	  var newArr = {};
	  var arr = $scope.shareholders;
	  for (var i=0; i<arr.length; i+=size) {
		newArr[i]=(arr.slice(i, i+size));
	  }
	  console.log(newArr);
	  return newArr;
	}

	$scope.getShareholderData();
	
	
	
	
});
