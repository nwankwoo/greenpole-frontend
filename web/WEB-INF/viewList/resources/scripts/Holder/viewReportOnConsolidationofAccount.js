var descriptor = "";
$(function(){
	$('.date').fdatepicker();
	/*$('.dateFrom').fdatepicker();
	$('.dateTo').fdatepicker();*/
	
	var nowTemp = new Date();
		var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
		var openingDate = $('.dateFrom').fdatepicker({
					onRender: function (date) {
						return date.valueOf() < now.valueOf() ? '' : '';
					}
				}).on('changeDate', function (ev) {
					if (ev.date.valueOf() > closingDate.date.valueOf()) {
						var newDate = new Date(ev.date)
						newDate.setDate(newDate.getDate() + 1);
					}
				}).data('datepicker');
				
		var closingDate = $('.dateTo').fdatepicker({
					onRender: function (date) {
						return date.valueOf() <= openingDate.date.valueOf() ? 'disabled' : '';
					}
				}).on('changeDate', function (ev) {
				}).data('datepicker');
	var status ="none";
	$(".dateSelector").change(function(e) {
		$('.date, .dateFrom, .dateTo').val("");
		var date = $(this).val();
		switch(date){
			case "all_account_merged_on_date":
				status = "exact";
				break;
			case "all_account_merged_between_date":
				status = "between";	
				break;
			case "all_account_merged_before_date":
				status = "before";
				break;
			case "all_account_merged_after_date":
				status = "after";
				break;
			default:
				status = "none";
				break;		
		}
       	$(".descriptor").val("date:"+status);
		if($(this).val()=="all_account_merged_between_date"){
			$(".fixed_").hide();
			$(".between").show();
		}
		else{
			$(".between").hide();
			$(".fixed_").show();
		}
		
    });
});

$(".exportToExcel").click(function(e) {
   window.open("exportConsolidatedAccount?mode=MSExcel");   
});	

$(".exportToPdf").click(function(e) {
   window.open("exportConsolidatedAccount?mode=PDF");   
});	
$(".exportToCSV").click(function(e) {
   window.open("exportConsolidatedAccount?mode=CSV");   
});	
$(".printReportOnConsolidationofAccount").click(function(e) {
    window.open("printReportOnConsolidationofAccount");
});
var App=angular.module('viewReportonAccountConsolidation',[]);
App.controller('viewReportonAccountConsolidationCtrl',function($scope,$http){
	$scope.pageSize=10;
	$scope.page=1;
	$scope.queryAccountConsolidation = function(){
		$.ajax({
			method : 'POST',
			url : $(".action").val(),
			data : $(".viewReportOnConsolidation").serialize(),
			header : {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.done(function(data){
			console.log(data);
			$scope.pageSize = 10;
			$scope.page = 1;
			$scope.isNew = true;
			if(data==="1"){
				$scope.response = "Query Successfull";
				$scope.getConsolidation();
			}
			else{
				$scope.response = "No record matches your search";
				showResponse($scope.response);
			}
			
			
			
		});
	}
	
	
	$scope.getConsolidation=function(){
		$http.get("getConsolidation?pageSize="+$scope.pageSize+"&page="+$scope.page)
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