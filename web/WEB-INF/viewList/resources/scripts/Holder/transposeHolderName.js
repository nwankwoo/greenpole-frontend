$(function(){
	
	var transposedarray= {};
	$(document).ready(function(e) {
        $.each(basenamearray,function(index,value){
			$(".holdersName li").eq(index).text(value);
			transposedarray[$(".namelist li").eq(index).attr("data-value")]=$(".holdersName li").eq(index).text();
		});
		//console.log(transposedarray);
    });
	$("#sortable").sortable({
		update: function(event,ui){
			transposedarray= {};
			$.each($(".namelist li"),function(index,value){
				transposedarray[$(this).attr("data-value")]=$(".holdersName li").eq(index).text();
			});
			//console.log($.parseJSON(transposedarray))
			//console.log(JSON.stringify(transposedarray));
		}
	});
	
	$(".transposeResetButton").click(function(e) {
        $.each(basenamearray,function(index,value){
			$(".holdersName li").eq(index).text(value);
		});
    });
    $("#sortable").disableSelection();
	
	$(".transposeNameButton").click(function(e) {
		console.log(transposedarray);
        reveal("Transposing holders name please wait...");
		$.post($(".transposeHolderName").attr("action"),{"holder":JSON.stringify(transposedarray)},function(data){
			console.log(data)
			window.parent.$(".close-reveal-modal").show();
		  	window.parent.$(".indicator").hide();
		  	window.parent.$(".note").text(data);
		  	//$(".transposeResetButton").click();	
		});
    });
	
});