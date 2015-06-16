$(function(){
	$('#login_form').on('valid.fndtn.abide', function() {
		$(".status").hide();
  		$("#indicator").show();
	});
});