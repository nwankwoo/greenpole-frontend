var shareholderList={}
var accountsToMerge=[];
var accountList={};
var primaryAccountIndex
var mergeShareholderAccountApp=angular.module("mergeShareholderAccountApp",[]);
mergeShareholderAccountApp.controller("mergeShareholderCtrl",function($scope){
	$scope.shareholderList=shareholderList;
});
$(function(){
	$even="style='background:#fff;padding-top:10px;border:1px solid gray;border-top:none'";
	$odd="style='padding-top:10px;border:1px solid gray;background:#efeeee;border-top:none'";
	$(document).ready(function(e) {
        $.each($(".viewRequest",window.parent.document),function(){
			var text = $(this).text().trim();
			var key;
			var hole;
			if(text==="Query Shareholder Account"){
				key=$(this).attr("key");
				hole=$(this).attr("hole");
				$src=$("#destination",window.parent.document).html();
				$src=$src+"pole?key="+key+'&hole='+hole;
				$("iframe").attr("src",$src);
				return true;
			}
			
		});
		
    });
	
var location="";
$(".next").click(function(e) {
	var valid=false;
	$(".error-alert").hide();
	
    switch(location){
		case "":	
			if($(".shareholderList").val()===""){
				$(".error-alert").find(".alert").text("Please select shareholder accounts to demerge");
				$(".error-alert").show();
				return false;
			}
			shareholderList=$.parseJSON($(".shareholderList").val());
			$header="style='padding-top:10px;padding-bottom:10px;border:1px solid gray;background:#ccc;border-top:none;font-weight:bold'";
			$secondaryAccountDiv="<div class='row' "+$header+">"+
											"<div class='large-2 columns text-center'>SN</div>"+
											"<div class='large-6 columns' style='padding:0'>Client Company</div>"+
											"<div class='large-4 columns text-center'>Share Unit</div></div>";
			$even="style='background:#fff;padding-top:10px;padding-bottom:10px;border:1px solid gray;border-top:none'";
			$odd="style='padding-top:10px;padding-bottom:10px;border:1px solid gray;background:#efeeee;border-top:none'";
			$.each(shareholderList.companyAccounts,function(index,obj){
				
				
				/*obj=obj.companyAccounts;
				console.log(obj);
				$.each(obj,function(_index,_obj){*/
					console.log(obj);
					$style= (index%2===0) ? $even : $odd;
					$secondaryAccountDiv+="<div class='row' "+$style+">"+
								"<div class='large-2 columns text-center' style='padding:0px'>"+(index+1)+"</div>"+
								"<div class='large-6 columns' style='padding:0px'> "+obj.clientCompanyName+"</div>"+
								"<div class='large-4 columns text-center' style='float:left'>"+obj.shareUnits+"</div></div>";
				//});
				
			});
			
			$(".next").hide();
			$(".previous").show();
			$(".confirmAccountList").html($secondaryAccountDiv);
			$(".confirmAccountList").children(".row").first().css("border-top","1px solid gray");
			$(".confirmAccountDeMergeDetails").click();
			location="confirmAccountDeMergeDetails";			
			break;
		default:
			break;
	}
	
});

$(".previous").click(function(e) {
     switch(location){
		 case "confirmAccountDeMergeDetails" :
		 	$(".queryShareholder").click();
			location="";
			$(".previous").hide();
			$(".next").show();
			break;
		
		default:
			break;
		
	 }
});

$(".confirmAndDeMergeAccounts").click(function(e) {
	$(".error-alert").hide();
	if(shareholderList.length==0){
		$(".error-alert").show();
		return false
	}
	
	
	reveal("Demerging holder account please wait...");
	console.log(JSON.stringify(shareholderList))
	$json = JSON.stringify(shareholderList);
	console.log(shareholderList)
	$.post($(".action").val(),{"accountId":shareholderList.holderId},function(data){
			window.parent.$(".close-reveal-modal").show();
		  	window.parent.$(".indicator").hide();
		  	window.parent.$(".note").text(data);
			
			$(".resetForm").click();
	});
});

$(".resetForm").click(function(e) {
    window.location.reload(true);
});
});
