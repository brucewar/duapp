$(function(){
	$('#loading').animate({"opacity": 0}, 1000, "linear", function(){
		$(this).hide();
	});

	$("#left_arrow").animate({"right": "20px"}, 2000, "linear");
	$('#bg_music')[0].play();
	var index = 0;
	var $pages = $('.box');
	var count = $pages.length;

	var startX = null;

	function handleTouchendEvent(event){
		if($(event.target).parent('.box').length <= 0){
			return false;
		}

		var endX;
		endX = event.changedTouches[0].clientX;

		var $page;
		if(endX != startX){
			if(endX < startX){
				if(index == 2){
					$("#left_arrow").hide();
				}
				if(index == count - 1){
					return false;
				}
				$page = $($pages[index++]);
				$page.addClass('hover');
			}else{
				$("#left_arrow").show();
				if(index == 0){
					return false;
				}
				$page = $($pages[--index]);
				$page.removeClass('hover');
			}
		}
	}
	document.addEventListener("touchstart", function(event){
		if($(event.target).parent('.box').length <= 0){
			return false;
		}
		startX = event.touches[0].clientX;
	}, false);
	document.addEventListener("touchend", handleTouchendEvent, false);

	//婚宴地址
	var map = new BMap.Map("b_map");
	var point = new BMap.Point(119.955764, 32.548343);
	map.centerAndZoom(point, 15);
	map.addControl(new BMap.ZoomControl());
	var marker = new BMap.Marker(new BMap.Point(119.955764, 32.548343));
	map.addOverlay(marker);
});

$('#music_btn').click(function(){
	var $bgMusic = $('#bg_music')[0];
	if($(this).hasClass('off')){
		$(this).removeClass('off');
		$($(this).children()[0]).addClass('rotate');
		$bgMusic.play();
	}else{
		$(this).addClass('off');
		$($(this).children()[0]).removeClass('rotate');
		$bgMusic.pause();
	}
});

$('#gallery').delegate('a', 'click', function(){
	var imageUrl = $(this).find('.thumb').css('background-image');
	imageUrl = imageUrl.match(/^url\((.*)\)$/)[1];
	var image = new Image();
	image.src = imageUrl;
	if(image.width >= image.height){
		$(image).css({
			"width": "100%",
			"margin-top": "35%"
		});
	}else{
		$(image).css({
			height: "100%"
		});
	}
	$('#bg_layer').append($(image)).show();
});

$('#bg_layer').click(function(){
	$(this).hide().empty();
});