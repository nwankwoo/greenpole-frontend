var descriptor = "";
$(function(){
	$('.date').fdatepicker();
	$('.dateFrom').fdatepicker();
	$('.dateTo').fdatepicker();
	
	$(".dateSelector").change(function(e) {
       
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