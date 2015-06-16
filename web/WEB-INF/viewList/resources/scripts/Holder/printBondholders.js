var App=angular.module('QueryBondholderAccountApp',[]);
var selected=[];
var shareholders=[];
var shareholderList=[];
App.controller('queryBondholderAccountCtrl',function($scope,$http){
	$scope.shareholderList=[];
	
	
	
	$scope.pageSize=1;
	$scope.page=1;
	$scope.holder={};
	$scope.bondholders={};
	$scope.subholders={};
	$scope.pages=[];
	$scope.dataSize=1;
	$scope.calls =0;
	$scope.getBondholderData=function(){
		$http.get("getBondholders?pageSize=ALL&page=ALL")
		.then(function(res){
			$scope.currentPage=$scope.page;	
			$scope.previousPage=$scope.currentPage-1;
			$scope.nextPage=$scope.currentPage+1;
			$scope.bondholders = res.data[1];
			$scope.dataSize = $scope.shareholders.length
			$scope.pageSize =$scope.dataSize / 10;
			
			
			
		});
	}
	
	$scope.holder.holdings=function(bondholder){
		$scope.totalHoldings=0;
		angular.forEach(bondholder.bondAccounts,function(account){
			$scope.totalHoldings+=account.bondUnits;
		});
		return $scope.totalHoldings;
	}
	
	$scope.subholders = function chunk(size) {
	  var newArr = {};
	  var arr = $scope.bondholders;
	  for (var i=0; i<arr.length; i+=size) {
		newArr[i]=(arr.slice(i, i+size));
	  }
	  console.log(newArr);
	  return newArr;
	}

	$scope.getBondholderData();
	
	
	
	
});

	