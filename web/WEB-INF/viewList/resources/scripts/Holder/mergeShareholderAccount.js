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
				$(".error-alert").find(".alert").text("Please select shareholder accounts to merge");
				$(".error-alert").show();
				return false;
			}
			$(".selectAccount").click();
			location="selectAccount";
			shareholderList=$.parseJSON($(".shareholderList").val());
			
			$header="style='padding-top:10px;border:1px solid gray;background:#ccc;border-top:none;font-weight:bold'";
			$header2="style='padding-top:10px;border:1px solid gray;background:#fff;border-top:none;font-weight:bold'";
			$(".accountList").html("<div class='row' "+$header+">"+
											"<div class='large-1 columns'><input type='checkbox'></div>"+
											"<div class='large-2 columns' style='padding:0'>Acc. No.</div>"+
											"<div class='large-5 columns' style='padding:0'>Shareholder Name</div>"+
											"<div class='large-3 columns'>Share Unit</div>");
			
			
			$(".mergedAccountList").html("<div class='row' "+$header2+"><div class='large-12 columns text-right' style='padding-bottom:5px'>Merged Accounts:&nbsp;"+
											"<span style='float:right' class='Mergedcount'>0</span></div></div>"+
											"<div class='row' "+$header+">"+
											"<div class='large-1 columns'><input type='checkbox'></div>"+
											"<div class='large-2 columns' style='padding:0'>Acc. No.</div>"+
											"<div class='large-5 columns' style='padding:0'>Shareholder Name</div>"+
											"<div class='large-3 columns'>Share Unit</div>");
				console.clear();							
			$.each(shareholderList,function(index,obj){
				console.log("from accounts to merge=");
				console.log(obj);
				$style= (index%2===0) ? $even : $odd;
				$(".accountList").append("<div class='row account' "+$style+">"+
											"<div class='large-1 columns'><input type='checkbox' class='accountToMerge' data-index="+index+"></div>"+
											"<div class='large-2 columns text-left' >"+obj.holderAcctNumber+"</div>"+
											"<div class='large-5 columns' style='padding:0px'> "+obj.firstName+" "+obj.middleName+" "+obj.lastName+"</div>"+
											"<div class='large-3 columns'>"+calculateHoldings(obj.companyAccounts,true)+"</div>");
			});
			
			$(".accountList").children(".row").first().css("border-top","1px solid gray");
			$(".mergedAccountList").children(".row").first().css("border-top","1px solid gray");
			$(".previous").show();
			break;
		
		case "selectAccount":	
		if(accountsToMerge.length==0 || $(".primaryAccount").val()==0){
				$(".error-alert").find(".alert").text("Please add accounts and select primary account to continue");
				$(".error-alert").show();
				return false;
			}	
			primaryAccountIndex=$(".primaryAccount option").index($(".primaryAccount option:selected"))-1;
			$primaryAccount=accountsToMerge[primaryAccountIndex];
			$primaryAccountDiv="<div class='row'><div class='large-2 columns text-left' >"+$primaryAccount.holderAcctNumber+"</div>"+
								"<div class='large-5 columns' style='padding:0px'> "+$primaryAccount.firstName+" "+$primaryAccount.middleName+" "+$primaryAccount.lastName+"</div>"+
								"<div class='large-3 columns' style='float:left'>"+calculateHoldings($primaryAccount.companyAccounts,true)+"</div></div>";
			$secondaryAccountDiv="";
			$totalUnits=0;
			$even_="style='background:#fff;padding-top:10px;padding-bottom:10px;border:1px solid gray;border-top:none'";
			$odd_="style='padding-top:10px;;padding-bottom:10px;border:1px solid gray;background:#efeeee;border-top:none'";
			console.clear();
			$.each(accountsToMerge,function(index,obj){
				
				$totalUnits+=parseInt(calculateHoldings(obj.companyAccounts,false));
				
				if(index==primaryAccountIndex) return true;
				$style= (index%2===0) ? $even_ : $odd_;
				$secondaryAccountDiv+="<div class='row' "+$style+"><div class='large-2 columns text-left'>"+obj.holderAcctNumber+"</div>"+"<div class='large-5 columns' style='padding:0px'> "+obj.firstName+" "+obj.middleName+" "+obj.lastName+"</div>"+
								"<div class='large-3 columns' style='float:left'>"+calculateHoldings(obj.companyAccounts,true)+"</div></div>";
			});
			//$secondaryAccountDiv+="";
			$newPrimaryAccountDiv="<div class='row'><div class='large-2 columns text-left'>"+$primaryAccount.holderAcctNumber+"</div>"+
								"<div class='large-5 columns' style='padding:0px'> "+$primaryAccount.firstName+" "+$primaryAccount.middleName+" "+$primaryAccount.lastName+"</div>"+
								"<div class='large-3 columns' style='float:left'>"+$totalUnits.toLocaleString()+"</div></div>";
			$(".primaryAccount").html($primaryAccountDiv);
			$(".secondaryAccounts").html($secondaryAccountDiv);
			$(".balance").html($newPrimaryAccountDiv);
			$(".secondaryAccounts").children(".row").first().css("border-top","1px solid gray");
			$(".confirmAccountMergeDetails").click();
			location="confirmAccountMergeDetails";
			$(".next").hide();
			break;
		
		default:
			break;
	}
	
});

$(".previous").click(function(e) {
     switch(location){
		 case "confirmAccountMergeDetails" :
		 	$(".selectAccount").click();
			location="selectAccount";
			$(".next").show();
			break;
		case "selectAccount" :
			$(".queryShareholder").click();
			location="";
			$(".previous").hide();
			break;
		default:
			break;
		
	 }
});

$(".addAccount").click(function(e) {
    $(".accountToMerge").each(function(index, element) {
		
		if($(this).is(":checked")){
			$accountIndex=$(this).attr("data-index");			
			$accountElement=$(element).parent().parent();
			$accountElement.remove();
			
			$(".mergedAccountList").append($accountElement);
			$(".mergedAccountList").find(".account").removeClass("account").addClass("accountToMergeRemove").find(".accountToMerge").removeClass("accountToMerge").addClass("accountToUnMerge").prop("checked",false);
			
		}
		});
		populatePrimaryAccountAndRepaint();
		
		 
		 
    
});

$(".removeAccount").click(function(e) {
    $(".accountToUnMerge").each(function(index, element) {
		if($(this).is(":checked")){
			$accountToRemoveIndex=$(".accountToUnMerge").index($(this));
			$accountElement=$(element).parent().parent();
			$accountElement.remove();
			$(".accountList").append($accountElement);
			$(".accountList").find(".accountToMergeRemove").removeClass("accountToMergeRemove").addClass("account").find(".accountToUnMerge").removeClass("accountToUnMerge").addClass("accountToMerge").prop("checked",false);
			
			
		}
		});
		
		populatePrimaryAccountAndRepaint();
		
});

$(".confirmAndMergeAccounts").click(function(e) {
	$(".error-alert").hide();
	if($(".primaryAccount").val()==0){
		$(".error-alert").show();
		return false
	}
	var _secondaryAccounts=[];
	var _primaryAccount;
    $.each(accountsToMerge,function(index,obj){
		
		delete obj['$$hashKey'];
		if(index==primaryAccountIndex){
			_primaryAccount=obj;
			return true;
		}
		_secondaryAccounts.push(obj);
	});
	accountList={};
	accountList['primaryHolder']=_primaryAccount;
	accountList['secondaryHolders']=_secondaryAccounts;
	
	reveal("Merging accounts please wait...");
	console.clear();
	console.log(JSON.stringify(accountList));
	$.post($(".action").val(),{"accounts":JSON.stringify(accountList)},function(data){
			window.parent.$(".close-reveal-modal").show();
		  	window.parent.$(".indicator").hide();
		  	window.parent.$(".note").text(data);
			
			$(".resetForm").click();
	});
});

$(".resetForm").click(function(e) {
    location.reload();
});
});

function populatePrimaryAccountAndRepaint(){
	$(".Mergedcount").text($(".accountToMergeRemove").length);
		$(".account").each(function(_index, element) {
			if(_index%2==0) $(this).css("background","#fff")
			else $(this).css("background","#efeeee")
         });
		$(".accountToMergeRemove").each(function(_index, element) {
                if(_index%2==0) $(this).css("background","#fff")
				else $(this).css("background","#efeeee")
         });
		 
		 
		 $(".Mergedcount").text($(".accountToMergeRemove").length);	
		$(".accountToMergeRemove").each(function(_index, element) {
                if(_index%2==0) $(this).css("background","#fff")
				else $(this).css("background","#efeeee")
        });
		$(".account").each(function(_index, element) {
			if(_index%2==0) $(this).css("background","#fff")
			else $(this).css("background","#efeeee")
         });
		 
		accountsToMerge=[];
		 $(".accountToUnMerge").each(function(index, element) {
			 $accountIndex=$(this).attr("data-index");	
			 accountsToMerge.push(shareholderList[$accountIndex]);
		});
		
		 $(".primaryAccount option").each(function(index, element) {
            element.remove();
        });
		 $(".primaryAccount").append('<option value="0">Select Primary Account</option>');
		 $.each(accountsToMerge,function(index,obj){	//"+obj.holderAcctNumber+"		
			$option="<option value='"+obj.firstName+"'>"+obj.holderAcctNumber+" "+obj.firstName+" "+obj.middleName+" "+obj.lastName+" "+calculateHoldings(obj.companyAccounts,true)+"</option>";
			 $(".primaryAccount").append($option);
		 });
}

function calculateHoldings(companyAccount,toNumber){
	var holdings=0;
	$.each(companyAccount,function(index,account){
		holdings+=account.shareUnits;
	});
	if(toNumber){
	return holdings.toLocaleString();
	}
	else{
		return holdings
	}
}