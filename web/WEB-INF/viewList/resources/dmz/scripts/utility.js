/***************************************************************************
*  Description : Utility File for performing some house keeping task.      *
*                                                                          *
*                                                                          *
*  Author : Yusuf Samsudeen Babashola (Algorithm)                          *
*                                                                          *
*                                                                          *
*  Date Created : 26 March 2015                                            *
*                                                                          *
*                                                                          *
*                                                                          *
*                                                                          *
*																		   *
***************************************************************************/
	$("input").attr("autocomplete","off");
$.fn.formToJSON = function() {
				var objectGraph = {};

				function add(objectGraph, name, value) {
					if(name.length == 1) {
						//if the array is now one element long, we're done
						objectGraph[name[0]] = value;
					}
					else {
						//else we've still got more than a single element of depth
						if(objectGraph[name[0]] == null) {
							//create the node if it doesn't yet exist
							objectGraph[name[0]] = {};
						}
					//recurse, chopping off the first array element
						add(objectGraph[name[0]], name.slice(1), value);
					}
				};
				//loop through all of the input/textarea elements of the form
				//this.find('input, textarea').each(function() {
				$(this).each(function() {
					//ignore the submit button
					if($(this).attr('type') != 'submit' && $(this).attr('type') != 'button') {
						if($(this).attr('name')!== undefined){
							$val = $(this).val();
							if($(this).attr('type') == 'radio'){
								//split the dot notated names into arrays and pass along with the value
								add(objectGraph, $(this).attr('name').split('.'), $(this).prop('checked'));
								
							}
							else{								
								add(objectGraph, $(this).attr('name').split('.'), $val);
							}
							
						
						}
					}
					
				});
				return JSON.stringify(objectGraph);
			};
			
$.fn.serializeObject = function(){
	var serializedArray = {};
	$(this).each( function( i, el ){
  var $field = $( this )
    , rawName = $field.attr( "name" )
    , matches = rawName.match( /^(.+?)\[\d+\]\['(.+)'\]$/ )
    , key
    , subKey
    , value = $field.val()
    var subValue = {}     ;

  if( matches ){

    if( !( key in serializedArray ) ){
      serializedArray[key] = [];
    }

    subValue[subKey] = value;
    serializedArray[key].push(subValue);

  } else {
    serializedArray[rawName] = value;

  }
});
return serializedArray ;
};

$(function(){
	var specialKeys = new Array();
	specialKeys.push(8);
	

	 $("input[type=number]").bind("keypress", function (e) {
		 var keyCode = e.which ? e.which : e.keyCode
         var ret = ((keyCode >= 48 && keyCode <= 57) || specialKeys.indexOf(keyCode) != -1 || keyCode==46);
         return ret;
     });
     $("input[type=number]").bind("paste", function (e) {
         return false;
     });
     $("input[type=number]").bind("drop", function (e) {
          return false;
     });
	 
	 
	  $('input[type=text]').bind('keypress', function (event) {
		var regex = new RegExp("^[a-zA-Z0-9_ ]+$");
		var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
		if (!regex.test(key)) {
		   event.preventDefault();
		   return false;
		}
});
     $("input[type=text]").bind("paste", function (e) {
         return false;
     });
     $("input[type=text]").bind("drop", function (e) {
          return false;
     });
});

function reveal(msg){
	window.parent.$(".note").text(msg);
	window.parent.$('a.reveal-link').trigger('click');
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function replaceAll(_find, replace, str) {
  return str.replace(new RegExp(_find, 'g'), replace);
}

function workingDaysBetweenDates(startDate, endDate) {
  
    // Validate input
    if (endDate < startDate)
        return 0;
    
    // Calculate days between dates
    var millisecondsPerDay = 86400 * 1000; // Day in milliseconds
    startDate.setHours(0,0,0,1);  // Start just after midnight
    endDate.setHours(23,59,59,999);  // End just before midnight
    var diff = endDate - startDate;  // Milliseconds between datetime objects    
    var days = Math.ceil(diff / millisecondsPerDay);
    
    // Subtract two weekend days for every week in between
    var weeks = Math.floor(days / 7);
    var days = days - (weeks * 2);

    // Handle special cases
    var startDay = startDate.getDay();
    var endDay = endDate.getDay();
    
    // Remove weekend not previously removed.   
    if (startDay - endDay > 0)         
        days = days - 2;      
    
    // Remove start day if span starts on Sunday but ends before Saturday
    if (startDay == 0 && endDay != 6)
        days = days - 1  
            
    // Remove end day if span ends on Saturday but starts after Sunday
    if (endDay == 6 && startDay != 0)
        days = days - 1  
    
    return days;
}

function readURL(input,target) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();
		var iSize = (input.files[0].size / 1024);
		iSize = (Math.round((iSize / 1024) * 100))
		if(iSize>200){
			return 'file too large';
		}
		else{
			
        reader.onload = function (e) {
			console.log(e.target.result);
			
            $(target).attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
		}
    }
}

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function describe(){
	
		var descriptor="";
		var setHolder = false;
		var shareunit = false;
		var totalholdings = false;
		var shareunitexact = true;
		var totalholdingsexact = true;
		$(".searchCriteria option:selected").each(function(index,value){
		
			
			if($(this).val()!=="share_unit" && $(this).val()!=="total_holdings"){
				if(!setHolder){
					setHolder = true;
				}
			}
			else if($(this).val()=="share_unit"){
				if(!shareunit){
					shareunit = true;
				}
				$exactRange = $(this).parent().parent().parent().find(".rangeSwitch");
				if($exactRange!==undefined){
					var text = $(this).parent().parent().parent().find(".rangeSwitch").text();
					
					if(text==="Range"){
						shareunitexact = true;
					}
					else if (text==="Exact"){
						shareunitexact = false;
					}
				}
			}
			else if($(this).val()=="total_holdings"){
				if(!totalholdings){
					totalholdings = true;
				}
				$exactRange = $(this).parent().parent().parent().find(".rangeSwitch");
				if($exactRange!==undefined){
					var text = $(this).parent().parent().parent().find(".rangeSwitch").text();
					
					if(text==="Range"){
						totalholdingsexact = true;
					}
					else if (text==="Exact"){
						totalholdingsexact = false;
					}
				}
			}	
		});
		
		if(setHolder){
			descriptor="holder:exact";
			if(shareunit){
				if(shareunitexact){
					descriptor+=";units:exact";
				}
				else{
					descriptor+=";units:range";
				}
			}
			else{
				descriptor+=";units:none";
			}
			if(totalholdings){
				if(totalholdingsexact){
					descriptor+=";totalHoldings:exact";
				}
				else{
					descriptor+=";totalHoldings:range";
				}
			}
			else{
				descriptor+=";totalHoldings:none";
			}
		}
		
		if(shareunit){
			
			// Set Shareholder
			if(!setHolder){
				descriptor="holder:none";
			}
			else{
				descriptor="holder:exact";
			}
			
			
			// Set Shareunit
			if(shareunitexact){
				descriptor+=";units:exact";
			}
			else{
				descriptor+=";units:range";
			}
			if(totalholdings){
				if(totalholdingsexact){
					descriptor+=";totalHoldings:exact";
				}
				else{
					descriptor+=";totalHoldings:range";
				}
			}
			else{
				descriptor+=";totalHoldings:none";
			}
			
		}
		
		
		if(totalholdings){
			
			// Set Shareholder
			if(!setHolder){
				descriptor="holder:none";
			}
			else{
				descriptor="holder:exact";
			}
			
			// Set Shareunit
			if(totalholdingsexact){
				descriptor+=";totalHoldings:exact";
			}
			else{
				descriptor+=";totalHoldings:range";
			}
			if(shareunit){
				if(shareunitexact){
					descriptor+=";units:exact";
				}
				else{
					descriptor+=";units:range";
				}
			}
			else{
				descriptor+=";units:none";
			}
			
		}
		console.log(descriptor);
		return descriptor;
}