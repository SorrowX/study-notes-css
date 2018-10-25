(function() {
	var bannerDom = document.querySelector('.banner')
	var innerDom = bannerDom['children'][0]
	var paginationDom = bannerDom['children'][1]
	var paginationChildren = paginationDom['children']

	var bannerWidth = parseInt(window.getComputedStyle(bannerDom, false)['width'])
	var bannerNum = innerDom.children.length, curIdx = 0
	var tick = null, time = 2000


	function setInnerDomStyle() {
		innerDom.style.width = bannerNum * bannerWidth + 'px'
	}

	function broadCast() {
		clearInterval(tick)
		tick = setInterval(function() {
			updateBanner()
			updateSpot()
		}, time)
	}

	function updateBanner() {
		++curIdx
		if (curIdx > bannerNum - 1) {
			curIdx = 0
			innerDom.style.left = 0 + 'px'
			innerDom.style.transition = 'left 0s'
			setTimeout(() => {
				updateBanner()
				updateSpot()
			}, 0)
			return
		} else {
			innerDom.style.transition = 'left 1s'
		}
		innerDom.style.left = (bannerWidth * curIdx * -1) + 'px'
	}

	function updateSpot() {
		let children = Array.prototype.slice.call(paginationChildren)
		if (curIdx === bannerNum - 1) {
	        children.forEach(function(dom, index) {
	        	dom.classList.remove('active')
	        })
		    paginationChildren[0].classList.add('active')
		} else {
	        children.forEach(function(dom, index) {
	        	if (index === curIdx) {
	        		dom.classList.add('active')
	        	} else {
	        		dom.classList.remove('active')
	        	}
	        })
		}
	}

	function main() {
		setInnerDomStyle()
		broadCast()
	}
	main()
})()