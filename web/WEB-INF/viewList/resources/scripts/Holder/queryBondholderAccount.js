var App=angular.module('QueryBondholderAccountApp',[]);
var selected=[];
var bondholderList= []
App.controller('queryBondholderAccountCtrl',function($scope,$http){
	
	$scope.bondholderList =[];
	$scope.getPage=function(page){
		$scope.page=page;		
		$scope.getHolderData();
	}
	$scope.isNew = false;
	$scope.queryBondholderAccountForm = function(){
		 var valid=true;
		 $(".queryBondholderAccountForm :input[type=text]").each(function(index, element) {
			 if($(this).attr("class")==="dateofbirth" && $(this).parent().css("display")==="none"){
				  return;
			 }
			 if( ($(this).val()==="") || ($(this).val()==="0") )
				valid=false;
        });
		$(".queryBondholderAccountForm :input[type=number]").each(function(index, element) {
			 
			 if( ($(this).val()==="") || ($(this).val()==="0") )
				valid=false;
        });
		$(".queryBondholderAccountForm select").each(function(index, element) {			
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
			url : $(".action").val(),
			data : $(".queryBondholderAccountForm").serialize(),
			header : {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.done(function(data){
			$scope.pageSize = 10;
			$scope.page = 1;
			$scope.isNew = true;
			console.log(data);
			if(data==="1"){
				$scope.response = "Query Successfull";
				$scope.getHolderData();
			}
			else{
				$scope.response = "No record matches your search";
				showResponse($scope.response);
			}
			
			
			
		});
	}
	
	$scope.pageSize=10;
	$scope.page=1;
	$scope.getHolderData=function(){
		$http.get("getBondholders?pageSize="+$scope.pageSize+"&page="+$scope.page)
		.then(function(res){	
			console.log(res);
			$scope._pageSize=$scope.pageSize;
			$scope.currentPage=$scope.page;	
			$scope.previousPage=$scope.currentPage-1;
			$scope.nextPage=$scope.currentPage+1;	
			$scope.bondholders = res.data[1];			
			bondholder=res.data;
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
	
	$scope.getHolderData();
	$scope.key=function($event){
		if ( ($event.keyCode==13) && ($scope.pageSize.trim()!="") ){
			$scope.page=1;
			$scope.getHolderData();
		}
		if( ($event.keyCode==13) && ($scope.pageSize.trim()=="") ){
			$scope.pageSize=10;
			$scope.page=1;
			$scope.getHolderData();
		}
		
	}
	var specialKeys = new Array();
	$scope.filter=function($event){
		var keyCode = $event.which ? $event.which : $event.keyCode
         var ret = ((keyCode >= 48 && keyCode <= 57));
         return ret;
	}
	$scope.holder={};
	$scope.holder.holdings=function(bondholder){
		$scope.totalHoldings=0;
		angular.forEach(bondholder.bondAccounts,function(account){
			$scope.totalHoldings+=account.bondUnits;
		});
		 if(parent==top){
			 $("._shareholdercheckbox").hide();
		 }
		return $scope.totalHoldings;
	}
	
	$scope.getBondholder=function(bondholder,index,obj){
		$scope.bondholderList[index]=bondholder;
		bondholderList.push(bondholder);
		//console.log(index);
		$location = $(".location",window.parent.document).val();
		//console.log($location)
		 if(parent!=top){
			 if($location === "mergeAccount"){
				 $list = (JSON.stringify($scope.bondholderList));
			//	 console.log($list);
				 $(".shareholderList",window.parent.document).val($list);
			 }
			 else{
				 $(".shareholderList",window.parent.document).val(JSON.stringify(bondholder));
			 }
			
			if($(".destinationHolder",window.parent.document).val()!=undefined){
				$(".destinationHolder",window.parent.document).val(JSON.stringify(bondholder));
			}
		}
		
		
	}
	
});

$(function(){
	
	$(".printBondholderList").click(function(e) {
        window.open("printBondholders?&page=ALL&pageSize=ALL");
    });
	
	$(".exportToExcel").click(function(e) {
   window.open("exportBondholders?mode=MSExcel");   
});	

$(".exportToPdf").click(function(e) {
   window.open("exportBondholders?mode=PDF");   
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
	 
	 $(document).ready(function(e) {
        if(parent==top){
			$(".shareholdercheckbox").hide();
		}
    });
	
	 $(document).on("click",".remove",function(){
		 $(this).parent().parent().remove();
		 repaint();
		 disableSelectedOptions();
	 });
	 
	 $(document).on("click",".add",function(){
		$clone=$(".searchForm").clone();
		
		$cloneSize=$clone.length;
		$searchForm=$clone.first();
		
		$searchForm.find(".remove").show();
		$searchForm.find("input[type=text]").val("");
		$searchForm.appendTo($(".fieldSetHolder"));
		$searchForm.find(".searchParameterHolder").html('<input type="text" class="searchParameter"/>');
		repaint();
		disableSelectedOptions();
	 });
	 
	 $(document).on("change",".criteria",function(){
		disableSelectedOptions();
	 })
	 
	 
	 
	 $(document).on("change",".searchCriteria",function(){
		 $val=$(this).val();
		 $index=$(".searchCriteria").index($(this));
		 var addressField='<div class="large-4 columns" style="padding:0;padding-right:5px">'+
                        '<small>Select Address Type</small>'+
                            '<select class="addressList">'+
                            	'<option value="0">Select Address</option>'+
                                '<option value="addressLineOne">Address Line One</option>'+
                                '<option value="addressLineTwo">Address Line Two</option>'+
                                '<option value="addressLineThree">Address Line Three</option>'+
                                '<option value="addressLineFour">Address Line Four</option>'+
                                '<option value="postCode">Post Code</option>'+
                                '<option value="city">City</option>'+
                                '<option value="state">State</option>'+
                                '<option value="country">Country</option>'+
                            '</select>'+
                        '</div>'+
                        '<div class="large-8 columns" style="padding:0;padding-left:5px">'+
                        	'<small>Enter Address</small>'+
                            '<input type="text" class="searchParameter">'+
                        '</div>';
		var searchParameter='<input type="text" class="searchParameter"/>';
		var typeParameter='<select name="holder.type">'+
								'<option value="0">Select Holder Type</option>'+
								'<option value="individual">Individual</option>'+
								'<option value="corporate">corporate</option>'+
						   '</select>';
		var genderParameter='<input type="radio" name="holder.gender" value="female" checked>&nbsp;Female&nbsp;&nbsp;<input type="radio" name="holder.gender" value="male">&nbsp;Male';
		
		var taxParameter='<input type="checkbox" name="holder.holderBondAccounts[0].taxExempted"/>&nbspTax Exempted';
		var esopParameter='<input type="checkbox" name="holder.holderBondAccounts[0].esop"/>&nbspESOP Status';
		var stockbrokerParameter='<select name="holder.holderBondAccounts[0].stockbroker">'+
									'<option value="0">Select Stockbrocker</option>'+								
						   		 '</select>';
		var shareUnitExact='<small class="large-12 columns rangeSwitch text-right" style="float:right;cursor:pointer;padding-bottom:2px">Range</small>';
		var units='<div class="units">'+searchParameter+'</div>';
		$(this).parent().parent().find(".searchParameterHolder").css("padding-top","0px");
		$(".searchParameterHolder").show();
		$(".dateofbirthParameterHolder").hide();
		 switch($val){
			 case "bondholder_name":
			 	$(this).parent().parent().find(".searchParameterHolder").html(searchParameter);
				
			 	$(this).parent().parent().find(".searchParameter").prop("name","holder.firstName");
			 	break;
			 case "bondholder_type":
			 	$(this).parent().parent().find(".searchParameterHolder").html(typeParameter);
			 	break;
			 case "gender":
			 	$(this).parent().parent().find(".searchParameterHolder").html(genderParameter);
				$(this).parent().parent().find(".searchParameterHolder").css("padding-top","10px");
			 	break;
			 case "dob":
				 $(".searchParameterHolder").hide();
				$(".dateofbirthParameterHolder").show();
			 	//$(this).parent().parent().find(".searchParameterHolder").html(searchParameter);
			 	break;
			 case "address":
			 	$(this).parent().parent().find(".searchParameterHolder").html(addressField);
			 	break;
			 case "phone_number":
			 	$(this).parent().parent().find(".searchParameterHolder").html(searchParameter);
			 	$(this).parent().parent().find(".searchParameter").prop("name","holder.holderPhoneNumbers[0].phoneNumber");
			 	break;
			 case "email_address":
			 	$(this).parent().parent().find(".searchParameterHolder").html(searchParameter);
			 	$(this).parent().parent().find(".searchParameter").prop("name","holder.holderEmailAddresses[0].emailAddress");
			 	break;
			case "tax_exempted":
			 	$(this).parent().parent().find(".searchParameterHolder").html(taxParameter);
				$(this).parent().parent().find(".searchParameterHolder").css("padding-top","10px");
			 	break;
			case "company_name":
			 	$(this).parent().parent().find(".searchParameterHolder").html(searchParameter);
			 	$(this).parent().parent().find(".searchParameter").prop("name","holder.holderCompanyAccounts[0].clientCompany");
			 	break;
			case "clearing_house":
			 	$(this).parent().parent().find(".searchParameterHolder").html(searchParameter);
			 	$(this).parent().parent().find(".searchParameter").prop("name","holder.chn");
			 	break;
			case "esop_status":
			 	$(this).parent().parent().find(".searchParameterHolder").html(esopParameter);
			 	$(this).parent().parent().find(".searchParameter").prop("name","holder.holderCompanyAccounts[0].esop");
			 	$(this).parent().parent().find(".searchParameterHolder").css("padding-top","10px");
			 	break;
			case "stockbrocker":
			 	$(this).parent().parent().find(".searchParameterHolder").html(stockbrokerParameter);
			 	break;
			case "certificate_number":
			 	$(this).parent().parent().find(".searchParameterHolder").html(searchParameter);
			 	$(this).parent().parent().find(".searchParameter").prop("name","holder.holderCompanyAccounts[0].certificateNumber");
			 	break;
			case "share_unit":
			 	$(this).parent().parent().find(".searchParameterHolder").html(shareUnitExact);
				$(this).parent().parent().find(".searchParameterHolder").append(units);
			 	$(this).parent().parent().find(".searchParameter").prop("name","shareUnits['start']");
			 	break;
			case "total_holdings":
			 	$(this).parent().parent().find(".searchParameterHolder").html(shareUnitExact);
				$(this).parent().parent().find(".searchParameterHolder").append(units);
			 	$(this).parent().parent().find(".searchParameter").prop("name","totalHoldings['start']");
			 	break;
			 default:
			 	break;
		 }
		 disableSelectedOptions();
	 });
	 
	 
	 $(document).on("click",".rangeSwitch",function(){
		 var index=$(".rangeSwitch").index($(this));
		 var text=$(this).text();
		 console.log("text="+text);
		 var range;
		 var exact;
		 $rangeCriteria=$(this).parent().parent().find(".searchCriteria option:selected").val();
		  switch($rangeCriteria){
			 case "share_unit":
			 	switch(text){
					case "Exact":
						exact='<input type="number" class="rangeExact" name="shareUnits[\'start\']"/>';
						 $(".units").eq(index).html(exact);
			 			 $(this).text("Range");
						break;
					case "Range":						
						range='<div class="large-6 columns" style="padding:0;padding-right:10px">'+
                        	'<small>Start</small>'+
                            '<input type="number" class="rangeStart" name="shareUnits[\'start\']">'+
                        '</div>'+
                        '<div class="large-6 columns" style="padding:0;padding-left:10px">'+
                        	'<small>End</small>'+
                            '<input type="number" class="rangeEnd" name="shareUnits[\'end\']">'+
                        '</div>';
						$(".units").eq(index).html(range);
			 			$(this).text("Exact");
						break;
					default:
						break;
				}
			 	break;
			 case "total_holdings":
			 	switch(text){
					case "Exact":
						exact='<input type="number" class="rangeExact" name="totalHoldings[\'start\']"/>';
						$(".units").eq(index).html(exact);
			 			 $(this).text("Range");
						break;
					case "Range":						
						range='<div class="large-6 columns" style="padding:0;padding-right:10px">'+
                        	'<small>Start</small>'+
                            '<input type="number" class="rangeStart" name="totalHoldings[\'start\']">'+
                        '</div>'+
                        '<div class="large-6 columns" style="padding:0;padding-left:10px">'+
                        	'<small>End</small>'+
                            '<input type="number" class="rangeEnd" name="totalHoldings[\'end\']">'+
                        '</div>';
						$(".units").eq(index).html(range);
			 			$(this).text("Exact");
						break;
					default:
						break;
				}
			 	break;
			default:
				break;
		  }
	 });
	 $(document).on("change",".addressList",function(){
		 $val=$(this).val();
		 switch($val){
			 case "addressLineOne":
			 	$(this).parent().parent().find(".searchParameter").prop("name","holder.addresses[0].addressLine1");
			 	break;
			 case "addressLineTwo":
			 	$(this).parent().parent().find(".searchParameter").prop("name","holder.addresses[0].addressLine2");
			 	break;
			 case "addressLineThree":
			 	$(this).parent().parent().find(".searchParameter").prop("name","holder.addresses[0].addressLine3");
			 	break;
			 case "addressLineFour":
			 	$(this).parent().parent().find(".searchParameter").prop("name","holder.addresses[0].addressLine4");
			 	break;
			 case "postCode":
			 	$(this).parent().parent().find(".searchParameter").prop("name","holder.addresses[0].postCode");
			 	break;
			 case "city":
			 	$(this).parent().parent().find(".searchParameter").prop("name","holder.addresses[0].city");
			 	break;
			 case "state":
			 	$(this).parent().parent().find(".searchParameter").prop("name","holder.addresses[0].state");
			 	break;
			 case "country":
			 	$(this).parent().parent().find(".searchParameter").prop("name","holder.addresses[0].country");
			 	break;
			 default:
			  	break;
		 }
	 });
	 
	 
	 var options = {          
        beforeSubmit:  showRequest, 
        success:       showResponse 
 
    }; 
	 $(".queryBondholderAccountForm").ajaxForm(options);
	 $(".queryBondholderAccountButton").click(function(e) {
		 var valid=true;
		 $(".queryBondholderAccountForm :input[type=text]").each(function(index, element) {
			 if( ($(this).val()==="") || ($(this).val()==="0") )
				valid=false;
        });
		
		$(".queryBondholderAccountForm select").each(function(index, element) {			
            if( ($(this).val()==="") || ($(this).val()==="0") )
				valid=false;
        });
		if(!valid){
			$(".error-alert").show();
			return;
		}
		$(".error-alert").hide();
        $(".queryBondholderAccountForm").submit();
    });
	
	
	
	$(document).on("click",".bondholderCheckBox",function(e) {
		$index=$(".bondholderCheckBox").index($(this));
		$location="";
		if(parent!=top){
			$location=$(".location",window.parent.document).val();
			
				if($(this).is(":checked")){
				  $(".bondholderCheckBox").prop("checked",false);
				  $(this).prop("checked",true);				  
				 // shareholderList.push(shareholders[$index]);
			  }
		}
    });
	
});


function showRequest() { 
    reveal("Querying bondholder account please wait...");
    return true; 
} 
 
function showResponse(responseText)  { 

  window.parent.$(".close-reveal-modal").show();
  window.parent.$(".indicator").hide();
  window.parent.$(".note").text(responseText); 
  console.log(responseText)
  if(responseText === "Query Successfull"){
	   window.parent.$(".close-reveal-modal").click();
	}
	else{
	} 
} 

function repaint(){
	$(".filterLabel").each(function(index, element) {
        $numword=toWords(index+1);		
		$(this).text("Search Filter " +$numword.charAt(0).toUpperCase() + $numword.slice(1));
    });
}

function disableSelectedOptions(){
	selected=[];
	$(".searchCriteria option:selected").each(function(index, element) {
		if($(this).val()!=="0"){
			  selected.push($(this).text());
		 }
        
    });
	console.log(selected);
	$(".searchCriteria option").each(function(index, element) {
			$(this).prop("disabled",false);
        
    });
	$(".searchCriteria option").each(function(index, element) {
		 if(selected.indexOf($(this).text())>=0){
			$(this).prop("disabled",true);
		}
        
    });
}

function rangeRepaint(){
	$(".rangeFilterLabel").each(function(index, element) {
        $numword=toWords(index+1);		
		$(this).text("Search Filter " +$numword.charAt(0).toUpperCase() + $numword.slice(1));
    });
	
}

function disableRangeSelectedOptions(){
	selected=[];
	$(".rangeCriteria option:selected").each(function(index, element) {
		if($(this).val()!=="0"){
			  selected.push($(this).text());
		 }
        
    });
	console.log(selected);
	$(".rangeCriteria option").each(function(index, element) {
			$(this).prop("disabled",false);
        
    });
	$(".rangeCriteria option").each(function(index, element) {
		 if(selected.indexOf($(this).text())>=0){
			$(this).prop("disabled",true);
		}
        
    });
}
