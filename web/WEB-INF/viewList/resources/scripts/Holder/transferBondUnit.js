var shareholderList={}
var accountsToMerge=[];
var accountList;
var primaryAccountIndex
var units=0;
var mergeShareholderAccountApp=angular.module("mergeShareholderAccountApp",[]);
mergeShareholderAccountApp.controller("mergeShareholderCtrl",function($scope){
	$scope.shareholderList=shareholderList;
});
$(function(){
	var destinationHolder;
	$even="style='background:#fff;padding-top:10px;border:1px solid gray;border-top:none'";
	$odd="style='padding-top:10px;border:1px solid gray;background:#efeeee;border-top:none'";
	$(document).ready(function(e) {
        $.each($(".viewRequest",window.parent.document),function(){
			var text = $(this).text().trim();
			var key;
			var hole;
			if(text==="Query Bondholder Account"){
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
				$(".error-alert").find(".alert").text("Please select bondholder accounts to transfer units from.");
				$(".error-alert").show();
				return false;
			}
			shareholderList=$.parseJSON($(".shareholderList").val());
			$header="style='padding-top:5px;padding-bottom:0px;border:1px solid gray;background:#ccc;border-top:none;font-weight:bold'";
			$secondaryAccountDiv="<div class='row' "+$header+">"+
											"<div class='large-1 columns text-center'><input type='checkbox' disabled/></div>"+
											"<div class='large-2 columns text-center'>SN</div>"+
											"<div class='large-5 columns' style='padding:0'>Bond Offer</div>"+
											"<div class='large-4 columns text-center'>Bond Unit</div></div>";
			$even="style='background:#fff;padding-top:10px;padding-bottom:0px;border:1px solid gray;border-top:none'";
			$odd="style='padding-top:10px;padding-bottom:0px;border:1px solid gray;background:#efeeee;border-top:none'";
			$.each(shareholderList.bondAccounts,function(index,obj){
				//obj=obj.holderBondAccounts;
				//$.each(obj,function(_index,_obj){
					$style= (index%2===0) ? $even : $odd;
					$secondaryAccountDiv+="<div class='row' "+$style+">"+
								"<div class='large-1 columns text-center' style='padding:0px'><input type='checkbox' class='selectAccountCheck'/></div>"+
								"<div class='large-2 columns text-center' style='padding:0px'>"+(index+1)+"</div>"+
								"<div class='large-5 columns' style='padding:0px'> "+obj.bondOfferTitle+"</div>"+
								"<div class='large-4 columns text-center accountUnits' style='float:left'>"+obj.bondUnits+"</div></div>";
			//	});
				
			});
			
			$secondaryAccountDiv+="<div class='row' style='margin-top:10px;'>"+
							"<div class='large-7 columns text-right' style='padding-top:10px'><small class='required' style='color:red'>*</small>&nbsp;Total units to transfer</div>"+
							"<div class='large-5 columns text-right' style='padding:0px'><input type='number' class='units' disabled/></div>"+
							"</div>";
			
			
			$(".previous").show();
			$(".confirmAccountList").html($secondaryAccountDiv);
			$(".confirmAccountList").children(".row").first().css("border-top","1px solid gray");
			$(".selectClientCompanyAccount").click();
			location="selectClientCompanyAccount";			
			break;
			case "selectClientCompanyAccount":
			if($(".units").val()=="" ||$(".units").val()==0){
				$(".error-alert").find(".alert").text("Please select bond offer and enter units to transfer.");
				$(".error-alert").show();
				return false;
			}
				$(".selectDestinationShareholderAccount").click();				
				$(".destHolderDiv").html('<input type="hidden" class="destinationHolder"/>');
				$(".destinationHolder").val(JSON.stringify(destinationHolder));
				location="selectDestinationShareholderAccount";	
				break;
			case "selectDestinationShareholderAccount":
			if($(".destinationHolder").val()===""){
				$(".error-alert").find(".alert").text("Please select bondholder accounts to transfer units to.");
				$(".error-alert").show();
				return false;
			}
				$header="style='padding-top:5px;padding-bottom:5px;border:1px solid gray;background:#ccc;border-top:1px solid gray;font-weight:bold'";
				$sourceHolder="<div class='row' "+$header+">"+
							"<div class='large-3 columns text-center'>CHN Number</div>"+
							"<div class='large-5 columns' style='padding:0'>Holder Name</div>"+
							"<div class='large-4 columns text-center'>Total Holdings</div></div>";
				$even="style='background:#fff;padding-top:10px;padding-bottom:5px;border:1px solid gray;border-top:none'";
				$sourceHolder+="<div class='row' "+$even+">"+
								"<div class='large-3 columns text-center' style='padding:0px'>"+shareholderList.chn+"</div>"+
								"<div class='large-5 columns' style='padding:0px'> "+shareholderList.firstName+" "+shareholderList.middleName+" "+shareholderList.lastName+"</div>";
				$totalholdings=0;
				$.each(shareholderList.bondAccounts,function(index,obj){
					$totalholdings+=obj.bondUnits;
				});
				
				
				$sourceHolder+="<div class='large-4 columns text-center accountUnits' style='float:left'>"+$totalholdings+"</div></div>";
				console.log(accountList);
				$ccAccountDiv="<div class='row' "+$header+">"+
									 "<div class='large-5 columns text-center' style='padding:0'>Bond Offer</div>"+
									 "<div class='large-4 columns text-center'>Bond Unit</div></div>"+
									 "<div class='row' "+$even+">"+
								"<div class='large-5 columns text-center' style='padding:0px'>"+accountList.bondOfferTitle+"</div>"+
								"<div class='large-4 columns text-center' style='padding:0px'> "+accountList.bondUnits+"</div></div>";
				
											
				$(".sourceHolder").html($sourceHolder);
				$(".ccAcount").html($ccAccountDiv);
				$(".transferUnit").html("<span style='color:red;font-weight:bold'>"+$(".units").val()+" Units </span>");
				destinationHolder=$.parseJSON($(".destinationHolder").val());
				$destinationHolderDiv="<div class='row' "+$header+">"+
							"<div class='large-3 columns text-center'>CHN Number</div>"+
							"<div class='large-5 columns' style='padding:0'>Holder Name</div>"+
							"<div class='large-4 columns text-center'>Total Holdings</div></div>";
				$even="style='background:#fff;padding-top:10px;padding-bottom:5px;border:1px solid gray;border-top:none'";
				$destinationHolderDiv+="<div class='row' "+$even+">"+
								"<div class='large-3 columns text-center' style='padding:0px'>"+destinationHolder.chn+"</div>"+
								"<div class='large-5 columns' style='padding:0px'> "+destinationHolder.firstName+" "+destinationHolder.middleName+" "+destinationHolder.lastName+"</div>";
				$totalholdings=0;
				$.each(destinationHolder.bondAccounts,function(index,obj){
					$totalholdings+=obj.bondUnits;
				});
				
				
				$destinationHolderDiv+="<div class='large-4 columns text-center accountUnits' style='float:left'>"+$totalholdings+"</div></div>";
				$(".destHolder").html($destinationHolderDiv);
				$(".confirmUnitTransfer").click();
				location="confirmUnitTransfer";
				$(".next").hide();
				break;
		default:
			break;
	}
	
});

$(".previous").click(function(e) {
     switch(location){
		 case "confirmUnitTransfer":
		 	$(".selectDestinationShareholderAccount").click();
			location="selectDestinationShareholderAccount";
			$(".next").show();
			break;
		 case "selectDestinationShareholderAccount":
		 		$(".selectClientCompanyAccount").click();
				location="selectClientCompanyAccount";
				
				break;
		 case "selectClientCompanyAccount" :
		 	$(".queryShareholder").click();
			location="";
			$(".previous").hide();
			$(".next").show();
			break;
		
		default:
			break;
		
	 }
});


$(".confirmAndTransferUnits").click(function(e) {
	$(".error-alert").hide();
	console.log(destinationHolder);
	$transferDetails={'holderIdFrom' : shareholderList.holderId, 'chnFrom' :shareholderList.chn, 'holderIdTo':destinationHolder.holderId, 'chnTo':destinationHolder.chn, 'units':$(".units").val(), 'bondOfferId':accountList.bondOfferId,'transferTypeId':'1'};
	reveal("Transfering bond units please wait...");
	$.post($(".action").val(),{"transferDetails":JSON.stringify($transferDetails)},function(data){
			window.parent.$(".close-reveal-modal").show();
		  	window.parent.$(".indicator").hide();
		  	window.parent.$(".note").text(data);
			
			$(".resetForm").click();
	});
});

$(".resetForm").click(function(e) {
    window.location.reload();
});

$(document).on("click",".selectAccountCheck",function(){
	accountList=[];
	if($(this).is(":checked")){
		$(".selectAccountCheck").prop("checked",false);
		$(this).prop("checked",true);
		$index = $(".selectAccountCheck").index($(this));
		accountList=shareholderList.bondAccounts[$index];
		$(".units").prop("disabled",false);
		$(".units").val('');
		$units=$(this).parent().parent().find(".accountUnits").text();
		$(".units").prop("max",parseInt($units));
		units=parseInt($units);
	}
});

$(document).on("keyup",".units",function(){
	$(this).val()>units ? $(this).val(units) : '';
})
});
