var App=angular.module('QueryClientCompanyApp',[]);
var selected=[];

App.controller('queryClientCompanyCtrl',function($scope,$http){
	$scope.clientCompanies = {};
	$scope.isNew = false;
	$scope.response;
	$scope.exactClientCompanyQuery=function(){
		var valid=true;
		 $(".exactClientCompanyQuery :input[type=text]").each(function(index, element) {
			 if( ($(this).val()==="") || ($(this).val()==="0") )
				valid=false;
        });
		
		$(".exactClientCompanyQuery select").each(function(index, element) {			
            if( ($(this).val()==="") || ($(this).val()==="0") )
				valid=false;
        });
		if(!valid){
			$(".error-alert").show();
			return;
		}
		$(".error-alert").hide();
		var description = "clientCompany:exact;shareUnit:none;numberOfShareholders:none;numberOfBondholders:none";
		$(".exactDescriptor").val(description);
		showRequest();
		$.ajax({
			method : 'POST',
			url : $(".action").val(),
			data : $(".exactClientCompanyQuery").serialize(),
			header : {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.done(function(data){
			$scope.pageSize = 10;
			$scope.page = 1;
			$scope.isNew = true;
			if(data==="1"){
				$scope.response = "Query Successfull";
				$scope.getClientCompanies();
			}
			else{
				$scope.response = "No record matches your search";
				showResponse($scope.response);
			}
			
			
			
		});
	}
	
	$scope.rangeClientCompanyQueryButton=function(){
		var valid=true;
		 $(".rangeClientCompanyQuery :input[type=text],input[type=number]").each(function(index, element) {
			 if( ($(this).val()==="") || ($(this).val()==="0") )
				valid=false;
        });
		
		$(".rangeClientCompanyQuery select").each(function(index, element) {			
            if( ($(this).val()==="") || ($(this).val()==="0") )
				valid=false;
        });
		/*if(!valid){
			$(".error-alert").show();
			return;
		}
		$(".error-alert").hide();*/
		var description="";
		var sorted=[];
		$(".rangeCriteria:eq(0) option").each(function(index, element) {
			if($(this).val()==="0"){
				return;
			}
			$val=$(this).val();
			$(".rangeCriteria option:selected").each(function(index, element) {
                if($(this).val()===$val){
					$status=$(this).parent().parent().parent().find(".rangeSwitch").text().trim().toLowerCase();
					if($status=="range"){ 
						$_status="exact";
						description+=$val+":"+$_status+";";
						sorted.push($(this).val());
					}
					if($status=="exact"){ 
						$_status="range";
						description+=$val+":"+$_status+";";
						sorted.push($(this).val());
					}
					
				}
            });
           
        });
		$(".rangeCriteria:eq(0) option").each(function(index, element) {
			if($(this).val()==="0"){
				return;
			}
			if($.inArray($(this).val(),sorted)==-1){
				description+=$(this).val()+":none;"
			}
		});
		 console.log(description);
		 description=description.substr(0,description.length-1);
		 description="clientCompany:none;"+description;
		 $("._descriptor").val("").val('"'+description+'"');
		 console.log($(".rangeClientCompanyQuery").serialize());
		 console.log(description);
		 showRequest();
		$.ajax({
			method : 'POST',
			url : $(".action").val(),
			data : $(".rangeClientCompanyQuery").serialize(),
			header : {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.done(function(data){
			console.log(data);
			$scope.pageSize = 10;
			$scope.page = 1;
			$scope.isNew = true;
			if(data==="1"){
				$scope.response = "Query Successfull";
				$scope.getClientCompanies();
			}
			else{
				$scope.response = "No record matches your search";
				showResponse($scope.response);
			}
			
			
			
		});
	}
	$scope.getPage=function(page){
		$scope.page=page;		
		$scope.getClientCompanies();
	}
	
	$scope.pageSize=10;
	$scope.page=1;
	$scope.getClientCompanies=function(){
		$http.get("getClientCompanyList?pageSize="+$scope.pageSize+"&page="+$scope.page)
		.then(function(res){	
			console.log(res);
			$scope._pageSize=$scope.pageSize;
			$scope.currentPage=$scope.page;	
			$scope.previousPage=$scope.currentPage-1;
			$scope.nextPage=$scope.currentPage+1;	
			$scope.clientCompanies = res.data[1];
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
	
	$scope.getClientCompanies();
	$scope.key=function($event){
		if ( ($event.keyCode==13) && ($scope.pageSize.trim()!="") ){
			$scope.page=1;
			$scope.getClientCompanies();
		}
		if( ($event.keyCode==13) && ($scope.pageSize.trim()=="") ){
			$scope.pageSize=10;
			$scope.page=1;
			$scope.getClientCompanies();
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
	
	$(".printClientCompanies").click(function(e) {
        window.open("printClientCompany?&page=ALL&pageSize=ALL");
    });
	
	$(".exportToExcel").click(function(e) {
   window.open("exportClientCompany?mode=MSExcel");   
});	
$(".exportToCsv").click(function(e) {
   window.open("exportClientCompany?mode=CSV");   
});	
$(".exportToPdf").click(function(e) {
   window.open("exportClientCompany?mode=PDF");   
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
		$searchForm.appendTo($(".searchFormDiv"));
		repaint();
		disableSelectedOptions();
	 });
	 
	 $(document).on("change",".criteria",function(){
		disableSelectedOptions();
	 })
	 
	 
	 $(document).on("click",".rangeRemove",function(){
		 $(this).parent().parent().remove();
		 rangeRepaint();
		 disableRangeSelectedOptions();
	 });
	 
	 $(document).on("click",".rangeAdd",function(){
		 if($(".rangeAdd").length>=3)
		 	return;
		$clone=$(".rangeSearchForm").clone();
		$cloneSize=$clone.length;
		$searchForm=$clone.first();
		$searchForm.find(".rangeRemove").show();
		$searchForm.find("input[type=text]").val("");
		$searchForm.appendTo($(".rangeSearchFormDiv"));
		rangeRepaint();
		disableRangeSelectedOptions();
	 });
	 
	 $(document).on("change",".rangeCriteria",function(){
		disableRangeSelectedOptions();
	 });
	 
	 $(document).on("click",".rangeSwitch",function(){
		 var index=$(".rangeSwitch").index($(this));
		 var text=$(this).text();
		 var range;
		 var exact;
		 $rangeCriteria=$(this).parent().parent().find(".rangeCriteria option[disabled]:selected").val();
		  switch($rangeCriteria){
			 case "shareUnit":
			 	switch(text){
					case "Exact":
						exact='<input type="number" class="rangeExact" name="shareUnit[\'start\']" min="0"/>';
						 $(".rangeField").eq(index).html(exact);
			 			 $(this).text("Range");
						break;
					case "Range":						
						range='<div class="large-6 columns" style="padding:0;padding-right:10px">'+
                        	'<small>Start</small>'+
                            '<input type="number" class="rangeStart" name="shareUnit[\'start\']" min="0">'+
                        '</div>'+
                        '<div class="large-6 columns" style="padding:0;padding-left:10px">'+
                        	'<small>End</small>'+
                            '<input type="number" class="rangeEnd" name="shareUnit[\'end\']" min="0">'+
                        '</div>';
						$(".rangeField").eq(index).html(range);
			 			$(this).text("Exact");
						break;
					default:
						break;
				}
			 	break;
			 case "numberOfShareholders":
			 	switch(text){
					case "Exact":
						exact='<input type="number" class="rangeExact" name="numberOfShareholders[\'start\']" min="0"/>';
						$(".rangeField").eq(index).html(exact);
			 			 $(this).text("Range");
						break;
					case "Range":						
						range='<div class="large-6 columns" style="padding:0;padding-right:10px">'+
                        	'<small>Start</small>'+
                            '<input type="number" class="rangeStart" name="numberOfShareholders[\'start\']" min="0">'+
                        '</div>'+
                        '<div class="large-6 columns" style="padding:0;padding-left:10px">'+
                        	'<small>End</small>'+
                            '<input type="number" class="rangeEnd" name="numberOfShareholders[\'end\']" min="0">'+
                        '</div>';
						$(".rangeField").eq(index).html(range);
			 			$(this).text("Exact");
						break;
					default:
						break;
				}
			 	break;
			 case "numberOfBondholders":
			 	switch(text){
					case "Exact":
						exact='<input type="number" class="rangeExact" name="numberOfBondholders[\'start\']" min="0"/>';
						$(".rangeField").eq(index).html(exact);
			 			 $(this).text("Range");
						break;
					case "Range":						
						range='<div class="large-6 columns" style="padding:0;padding-right:10px">'+
                        	'<small>Start</small>'+
                            '<input type="number" class="rangeStart" name="numberOfBondholders[\'start\']" min="0">'+
                        '</div>'+
                        '<div class="large-6 columns" style="padding:0;padding-left:10px">'+
                        	'<small>End</small>'+
                            '<input type="number" class="rangeEnd" name="numberOfBondholders[\'end\']" min="0">'+
                        '</div>';
						$(".rangeField").eq(index).html(range);
			 			$(this).text("Exact");
						break;
					default:
						break;
				}
			 	break;			
			 default:
			 	break;
		 }
		/* var index=$(".rangeSwitch").index($(this));
		 if(text==="Range"){
			 $(".rangeField").eq(index).html(range);
			 $(this).text("Exact");
		 }
		 else{
			 $(".rangeField").eq(index).html(exact);
			 $(this).text("Range");
		 }*/
	 });
	 
	 $(document).on("change",".exactSearchCriteria",function(){
		 $val=$(this).val();
		 $index=$(".exactSearchCriteria").index($(this));
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
		 switch($val){
			 case "name":
			 	$(this).parent().parent().find(".searchParameterHolder").html(searchParameter);
			 	$(this).parent().parent().find(".searchParameter").prop("name","clientCompany.name");
			 	break;
			 case "code":
			 	$(this).parent().parent().find(".searchParameterHolder").html(searchParameter);
			 	$(this).parent().parent().find(".searchParameter").prop("name","clientCompany.code");
			 	break;
			 case "ceo":
			 	$(this).parent().parent().find(".searchParameterHolder").html(searchParameter);
			 	$(this).parent().parent().find(".searchParameter").prop("name","clientCompany.ceo");
			 	break;
			 case "addresses":
			 	$(this).parent().parent().find(".searchParameterHolder").html(addressField);
			 	break;
			 case "phoneNumbers":
			 	$(this).parent().parent().find(".searchParameterHolder").html(searchParameter);
			 	$(this).parent().parent().find(".searchParameter").prop("name","clientCompany.phoneNumbers[0].phoneNumber");
			 	break;
			 case "emailAddresses":
			 	$(this).parent().parent().find(".searchParameterHolder").html(searchParameter);
			 	$(this).parent().parent().find(".searchParameter").prop("name","clientCompany.emailAddresses[0].emailAddress");
			 	break;
			 case "depositoryName":
			 	$(this).parent().parent().find(".searchParameterHolder").html(searchParameter);
			 	$(this).parent().parent().find(".searchParameter").prop("name","clientCompany.depositoryName");
			 	break;
			 default:
			 	break;
		 }
		 disableSelectedOptions();
	 });
	 
	 $(document).on("change",".addressList",function(){
		 $val=$(this).val();
		 switch($val){
			 case "addressLineOne":
			 	$(this).parent().parent().find(".searchParameter").prop("name","clientCompany.addresses[0].addressLine1");
			 	break;
			 case "addressLineTwo":
			 	$(this).parent().parent().find(".searchParameter").prop("name","clientCompany.addresses[0].addressLine2");
			 	break;
			 case "addressLineThree":
			 	$(this).parent().parent().find(".searchParameter").prop("name","clientCompany.addresses[0].addressLine3");
			 	break;
			 case "addressLineFour":
			 	$(this).parent().parent().find(".searchParameter").prop("name","clientCompany.addresses[0].addressLine4");
			 	break;
			 case "postCode":
			 	$(this).parent().parent().find(".searchParameter").prop("name","clientCompany.addresses[0].postCode");
			 	break;
			 case "city":
			 	$(this).parent().parent().find(".searchParameter").prop("name","clientCompany.addresses[0].city");
			 	break;
			 case "state":
			 	$(this).parent().parent().find(".searchParameter").prop("name","clientCompany.addresses[0].state");
			 	break;
			 case "country":
			 	$(this).parent().parent().find(".searchParameter").prop("name","clientCompany.addresses[0].country");
			 	break;
			 default:
			  	break;
		 }
	 });
	 
	  $(document).on("change",".rangeCriteria",function(){
		 
		 $val=$(this).children().each(function(index, element) {
            $(element).prop("disabled",false);
        });
		 $val=$(this).val();
		 disableRangeSelectedOptions();
		 $index=$(".rangeCriteria").index($(this));
		 $rangeText=$(this).parent().parent().find(".rangeSwitch").text();
		 switch($val){
			 case "shareUnit":
			 	switch($rangeText){
					case "Range":
						$(this).parent().parent().find(".rangeExact").prop("name","shareUnit['start']");
						break;
					case "Exact":
						$(this).parent().parent().find(".rangeStart").prop("name","shareUnit['start']");
						$(this).parent().parent().find(".rangeEnd").prop("name","shareUnit['end']");
						break;
					default:
						break;
				}
			 	break;
			 case "numberOfShareholders":
			 	switch($rangeText){
					case "Range":
						$(this).parent().parent().find(".rangeExact").prop("name","numberOfShareholders['start']");
						break;
					case "Exact":
						$(this).parent().parent().find(".rangeStart").prop("name","numberOfShareholders['start']");
						$(this).parent().parent().find(".rangeEnd").prop("name","numberOfShareholders['end']");
						break;
					default:
						break;
				}
			 	break;
			 case "numberOfBondholders":
			 	switch($rangeText){
					case "Range":
						$(this).parent().parent().find(".rangeExact").prop("name","numberOfBondholders['start']");
						break;
					case "Exact":
						$(this).parent().parent().find(".rangeStart").prop("name","numberOfBondholders['start']");
						$(this).parent().parent().find(".rangeEnd").prop("name","numberOfBondholders['end']");
						break;
					default:
						break;
				}
			 	break;			
			 default:
			 	break;
		 }
	 });
	 
	 var options = {          
        beforeSubmit:  showRequest, 
        success:       showResponse 
 
    }; 
	 $(".exactClientCompanyQuery").ajaxForm(options);
	 $(".exactClientCompanyQueryButton").click(function(e) {
		 var valid=true;
		 $(".exactClientCompanyQuery :input[type=text]").each(function(index, element) {
			 if( ($(this).val()==="") || ($(this).val()==="0") )
				valid=false;
        });
		
		$(".exactClientCompanyQuery select").each(function(index, element) {			
            if( ($(this).val()==="") || ($(this).val()==="0") )
				valid=false;
        });
		if(!valid){
			$(".error-alert").show();
			return;
		}
		$(".error-alert").hide();
		var description = "clientCompany:exact;shareUnit:none;numberOfShareholders:none;numberOfBondholders:none";
		$(".exactDescriptor").val(description);
        $(".exactClientCompanyQuery").submit();
    });
	
	
	
	 $(".rangeClientCompanyQueryButton").click(function(e) {
		 var valid=true;
		 $(".rangeClientCompanyQuery :input[type=text],input[type=number]").each(function(index, element) {
			 if( ($(this).val()==="") || ($(this).val()==="0") )
				valid=false;
        });
		
		$(".rangeClientCompanyQuery select").each(function(index, element) {			
            if( ($(this).val()==="") || ($(this).val()==="0") )
				valid=false;
        });
		/*if(!valid){
			$(".error-alert").show();
			return;
		}
		$(".error-alert").hide();*/
		var description="";
		var sorted=[];
		$(".rangeCriteria:eq(0) option").each(function(index, element) {
			if($(this).val()==="0"){
				return;
			}
			$val=$(this).val();
			$(".rangeCriteria option:selected").each(function(index, element) {
                if($(this).val()===$val){
					$status=$(this).parent().parent().parent().find(".rangeSwitch").text().trim().toLowerCase();
					console.log($status);
					if($status=="range"){ 
						//$_status="exact";
						console.log($status);
						description+=$val+":"+$status+";";
						sorted.push($(this).val());
					}
					if($status=="exact"){ 
						//$_status="range";
						console.log($status);
						description+=$val+":"+$status+";";
						sorted.push($(this).val());
					}
					
				}
            });
           
        });
		$(".rangeCriteria:eq(0) option").each(function(index, element) {
			if($(this).val()==="0"){
				return;
			}
			if($.inArray($(this).val(),sorted)==-1){
				description+=$(this).val()+":none;"
			}
		});
		 description=description.substr(0,description.length-1);
		 $("._descriptor").val("").val('"'+description+'"');
		// $(".rangeClientCompanyQuery").submit();
        
    });
});


function showRequest() { 
    reveal("Querying client company please wait...");
    return true; 
} 
 
function showResponse(responseText)  { 

  window.parent.$(".close-reveal-modal").show();
  window.parent.$(".indicator").hide();
  window.parent.$(".note").text(responseText); 
 // if(responseText === "Query Successfull"){
	   window.parent.$(".close-reveal-modal").click();
	/*}
	else{
	} */
} 

function repaint(){
	$(".filterLabel").each(function(index, element) {
        $numword=toWords(index+1);		
		$(this).text("Search Filter " +$numword.charAt(0).toUpperCase() + $numword.slice(1));
    });
}

function disableSelectedOptions(){
	selected=[];
	$(".exactSearchCriteria option:selected").each(function(index, element) {
		if($(this).val()!=="0"){
			  selected.push($(this).text());
		 }
        
    });
	console.log(selected);
	$(".exactSearchCriteria option").each(function(index, element) {
			$(this).prop("disabled",false);
        
    });
	$(".exactSearchCriteria option").each(function(index, element) {
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
