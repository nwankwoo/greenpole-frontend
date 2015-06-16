var App=angular.module('ViewShareUnitApp',[]);

App.controller('getShareUnitCtrl',function($scope,$http){
	
	
	$scope.getPage=function(page){
		$scope.page=page;		
		$scope.getUserData();
	}
	
	$scope.pageSize=10;
	$scope.page=1;
	$scope.getShareUnitQuotation=function(){
		$http.get("getShareUnitQuotation?pageSize="+$scope.pageSize+"&page="+$scope.page)
		.then(function(res){
			
			$scope._pageSize=$scope.pageSize;
			$scope.currentPage=$scope.page;	
			$scope.previousPage=$scope.currentPage-1;
			$scope.nextPage=$scope.currentPage+1;	
			$scope.quotations = res.data[1];
			$scope.numberOfPages=res.data[0];
			$scope.totalPages=$scope.numberOfPages.length;
			$scope.totalRecord=res.data[2];	
			if($scope.totalPages>5 && $scope.currentPage>5){
				$scope.numberOfPages.splice(0,$scope.currentPage-5);
			}
			
		});
	}
	
	$scope.getShareUnitQuotation();
	$scope.key=function($event){
		if ( ($event.keyCode==13) && ($scope.pageSize.trim()!="") ){
			$scope.page=1;
			$scope.getUserData();
		}
		if( ($event.keyCode==13) && ($scope.pageSize.trim()=="") ){
			$scope.pageSize=10;
			$scope.page=1;
			$scope.getUserData();
		}
		
	}
	var specialKeys = new Array();
	$scope.filter=function($event){
		var keyCode = $event.which ? $event.which : $event.keyCode
         var ret = ((keyCode >= 48 && keyCode <= 57));
         return ret;
	}
	
});

$(function(){
	$(".printReport").click(function(e) {
        window.open("printShareQuotation?&page=ALL&pageSize=ALL");
    });
	
	$(".exportToExcel").click(function(e) {
   window.open("exportShareQuotation?mode=MSExcel");   
});	

$(".exportToPdf").click(function(e) {
   window.open("exportShareQuotation?mode=PDF");   
});	
	
	var specialKeys = new Array();
	specialKeys.push(8);
	 $(".pageSize").bind("keypress", function (e) {
		 var keyCode = e.which ? e.which : e.keyCode
         var ret = ((keyCode >= 48 && keyCode <= 57) || specialKeys.indexOf(keyCode) != -1);
         return ret;
     });
     $(".pageSize").bind("paste", function (e) {
         return false;
     });
     $(".pageSize").bind("drop", function (e) {
          return false;
     });
});


