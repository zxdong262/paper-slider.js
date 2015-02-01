/* ------------------------------------------------------------------------
    plugin-name:jQuery Paper Slider
    Developped By: ZHAO Xudong, zxdong@gmail.com -> http://html5beta.com/jquery-2/jquery-paper-slider/
    Version: 1.0.6
    License: MIT
------------------------------------------------------------------------ */

(function($){
	function PS(opts, ob) {
		var defaults = {
			speed: 500
			,timer: 4000
			,autoSlider: true
			,hasNav: true
			,pauseOnHover: true
			,navLeftTxt: '&lt;'
			,navRightTxt: '&gt;'
			,zIndex:20
			,ease: 'linear'
			,beforeAction: null
			,afterAction: null
		}
		,th = this
		,defs = th.defs = $.extend(defaults, opts)
		,cssSet = {
			position:'absolute'
			,left:0
			,right:0
			,width:'100%'
			,height:'100%'
			,'z-index': defs.zIndex
		}
		th.t = ob.show().wrapInner('<div class="paper-slides" />')
		th.p = th.t.children().css(cssSet)
		th.ps = th.p.children().addClass('paper-slide').css(cssSet)
		th.len = th.ps.length
		th.flag = null
		th.pause = false
		th.onAction = false
		th.currentPage = 0

		//init z-index
		th.ps.eq(0).css('z-index', defs.zIndex + 1).end().filter(':odd').addClass('ps-odd')
		
		//auto start
		if(th.defs.autoSlider) {
			th.flag = setTimeout(function() {
				th.autoroll()
			}, defs.timer)
		}
		
		//OnHover
		th.t.hover(function() {
		  $(this).addClass('ps-hover')
			if(defs.pauseOnHover) th.pause = true
		},function() {
		  $(this).removeClass('ps-hover')
			if(defs.pauseOnHover) th.pause = false
		})
		
		//paper link
		th.t.on('click', '.ps-link', function() {
			if(th.onAction) return
			th.onAction = true
			var i1 = parseInt($(this).data('ps-page'))
			,i2 = (i1 + th.len) % th.len
			,isNext = i1 > th.currentPage
			if(i2 === th.currentPage) return
			th.action(isNext, i2)
		})
		
		//navs
		if(defs.hasNav) {
			th.t.append('<a href="javascript:;" class="ps-nav ps-nav-prev">' + defs.navLeftTxt +
			'</a><a href="javascript:;" class="ps-nav ps-nav-next">' + defs.navRightTxt + '</a>')
			.children('.ps-nav').css('z-index', defs.zIndex + 10 + th.len)
			th.t.on('click', '.ps-nav', function() {
			  if(th.onAction) return
  			th.onAction = true
  			var isNext = $(this).hasClass('ps-nav-next')
  			,len = th.len
  			,i = isNext? (th.currentPage + 1 + len) % len : (th.currentPage - 1 + len) % len 
  			th.action(isNext, i)
			})
		}
	}
	
	PS.prototype = {
	  action: function(isNext,index) {
			var th = this
			,defs = th.defs
			,speed = defs.speed
			,c = th.currentPage
			,ps = th.ps
			,step = isNext?50 : -50
			,cp = ps.eq(c)
			,ip = ps.eq(index)
			cp.css({
				'z-index': defs.zIndex + 2
			}).addClass('ps-on').show()
			ip.css({
				'z-index': defs.zIndex + 1
			}).addClass('ps-on').show()
			ps.filter(function() {
			  return !$(this).hasClass('ps-on')
			}).css('z-index', defs.zIndex)
			$.isFunction(th.defs.beforeAction) && th.defs.beforeAction.call(th)
			cp.animate({
				left: -step + '%'
			}, speed, defs.ease, function() {
				cp.css('z-index', defs.zIndex + 1).animate({
					left:0
				},speed)
			});
			ip.animate({
				left:step
			}, speed, defs.ease, function() {
				cp.removeClass('ps-on')
				ip.css('z-index', defs.zIndex + 2).removeClass('ps-on').animate({
					left:0
				}, speed)
				th.currentPage = index
				th.onAction = false
				$.isFunction(th.defs.afterAction) && th.defs.afterAction.call(th)
				if(defs.autoSlider) {
					clearTimeout(th.flag)
					th.flag = setTimeout(function() {
						th.autoroll()
					}, defs.timer)
				}
			})
		}
		,autoroll: function() {
			var t = this
			if(!t.onAction && !t.pause) {
				  t.onAction = true
				  var i = (t.currentPage + 1 + t.len) % t.len
				  if(!t.pause) t.action(true,i)
			}
			else {
				clearTimeout(t.flag)
				t.flag = setTimeout(function() {
					t.autoroll()
				}, t.defs.timer)
			}
		}
		,destroy: function() {
			var t = this
			clearTimeout(t.flag)
			t.ps.unwrap()
			t.t.off( 'click', '**' ).removeAttr('style').children('.ps-nav').remove()
			t.t.children('.paper-slide').removeAttr('style').removeClass('paper-slide')
			$.each( t, function( key, value ) {
				delete t[key]
			})
		}
		
	}
	
	//jquery plugin
	$.fn.paperSlider = function(opts) {
		return new PS(opts, this)
    }
})(jQuery)
 