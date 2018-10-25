;(function() {
    var movieNavDom = document.querySelector('#movie-nav')
	var movieCurNavDom = document.querySelector('#movie-cur-nav')
	var movieWrapperDom = document.querySelector('#movie-wrapper')
	var aUl = Array.prototype.slice.call(movieNavDom.children)

	function addMouseoverEvt() {
		aUl.forEach(function(dom) {
			dom.addEventListener('mouseover', (evt) => {
				disabledMouseWheel(movieWrapperDom, true)
			}, false)
			dom.addEventListener('mouseout', (evt) => {
				disabledMouseWheel(movieWrapperDom, false)
			}, false)
			dom.onmousewheel = function(evt) {
				var diff = 20, curScrollLeft = 0
				var childrenWidth = parseInt(window.getComputedStyle(dom, false)['width'])
				var width = dom.children.length * childrenWidth

				if (evt.wheelDelta > 0) { // 向上是正数 x轴向左
					curScrollLeft = dom.scrollLeft - diff
					if (curScrollLeft <= 0) {
						curScrollLeft = 0
					}
				} else { // 表示向下是负数 x轴向右
					curScrollLeft = dom.scrollLeft + diff
					if (curScrollLeft >= width) {
						curScrollLeft = width
					}
				}

				dom.scrollTo(curScrollLeft, dom.scrollTop)
			}
		})
	}
	addMouseoverEvt()


    /*
     * 是否禁止movie-wrapper容器滚动
     * dom  Element (禁止滚动的dom)
     * bool Boolean (true: 禁止滚动 false: 取消滚动)
    */
    function disabledMouseWheel(dom, bool) {

		dom.onmousewheel = bool ? wheelFn : null

    	function wheelFn(evt) {
    	    evt = evt || window.event
    	    if(evt.preventDefault) { // Firefox  
    	        evt.preventDefault() 
    	        evt.stopPropagation()  
    	    } else { // IE  
    	        evt.cancelBubble = true
    	        evt.returnValue = false
    	    }
    	    return false
    	}
    }
    // disabledMouseWheel(movieWrapperDom, true)

    /*
     * 列表父dom容器滚动距离是否超过指定子dom容器的高度
     * parentDom  Element (父容器dom)
     * sonDom  Element (父容器中子dom)
     * cb Function (回调返回Boolean true: 超过 false: 未超过)
     * return Function (调用该方法会取消scroll事件)
    */
    function beyondHeight(parentDom, sonDom, cb) {
    	var sonDomStyle = window.getComputedStyle(sonDom, false)
    	var sonDomHeight = parseInt(sonDomStyle['height'])

    	function scrollFn(evt) {
    		if (evt.target.scrollTop >= sonDomHeight) {
    			cb && cb(true)
    		} else {
    			cb && cb(false)
    		}
    	}
    	parentDom.addEventListener('scroll', scrollFn, false)
    	return function() {
    		parentDom.removeEventListener('scroll', scrollFn)
    	}
    }
    beyondHeight(movieWrapperDom, movieNavDom, function(bool) {
    	// console.log('超过啦: ', bool)
        if (bool) {
            movieCurNavDom.style.display = 'block'
        } else {
            movieCurNavDom.style.display = 'none'
        }
    })

})()