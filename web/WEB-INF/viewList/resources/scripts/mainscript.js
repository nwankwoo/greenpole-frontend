(function($) {
    var store = new Persist.Store('GreenPoleStore');
    $(document).foundation().foundation('joyride', 'start');
    $(".full-height").css("height",$(document).height()); 
    $(".sub-window").css("height",$(document).height()); 
   // $("iframe").css("height",$(document).height()); 
    $("iframe").css("height",$(window).height()-100); 
    $(document).ready(function() {
        store.get('src', function(ok, val) {
            if (ok)
              $("iframe").attr("src",val);
          });
        $('.sb-toggle-submenu').click(function() {
	$menu=$('.sb-toggle-submenu');
	$.each($menu,function(i,v){
            $prevmenu = $(v).parent().children('.sb-submenu');
            if($(v).hasClass('sb-submenu-active')){
		$(v).removeClass('sb-submenu-active');
            }
            if ($prevmenu.hasClass('sb-submenu-active')) {
		$prevmenu.slideUp(200);
		$(v).add($prevmenu).toggleClass('sb-submenu-active');
            } 
            $(v).removeClass('sb-submenu-active');
        });
	$submenu = $(this).parent().children('.sb-submenu');
	$(this).add($submenu).toggleClass('sb-submenu-active');
	if ($submenu.hasClass('sb-submenu-active')) {
            $submenu.slideDown(200);
        } 
        else {
            $submenu.slideUp(200);
	}
        });
        
    });
    
    $(".logout").click(function(){
        $("#logout_form").submit();
    });
    
    $(".viewRequest").click(function(){
        $key=$(this).attr("key");
        $hole=$(this).attr("hole");
        $src=$("#destination").html();
        $src=$src+"pole?key="+$key+'&hole='+$hole;
        store.set("src",$src);
        $("iframe").attr("src",$src);
		$(".viewTitle").text($(this).text());
		
    });
    
    $(".notification").click(function(){
        $from=$(this).attr("from");
        $to=$(this).attr("to");
		$code=$(this).attr("code");
        $src=$("#destination").html();
        $src=$src+'index/'+$from+'/'+$to+'/'+$code;
        store.set("src",$src);
        $("iframe").attr("src",$src);
		$(".viewTitle").text($(this).text());
		
    });             
}) (jQuery);

