var PHOTO_WIDTH = [200, 220] // 随机选取一个图片容器的宽度
var TOP_HEIGHT = 100 // 照片墙图片距离容器顶部的距离
var ONE_BY_ONE = true // 是否一个一个地显示照片
var imgMaxNum = 50 // 照片墙显示的最大图片数量
var transitionTime = 1 // transition动画的过渡时间单位/秒

var mouseDownTransitionStyle = `box-shadow ${transitionTime}s ease, transform ${transitionTime}s ease, opacity ${transitionTime}s ease`
var defaultTransitionStyle = function(timingFunction, time) {
	timingFunction = timingFunction || 'ease'
	time = time || transitionTime
	return `box-shadow ${time}s ${timingFunction}, transform ${time}s ${timingFunction}, opacity ${time}s ${timingFunction}, left ${time}s ${timingFunction}, top ${time}s ${timingFunction}`
}

function getArrImgPath() {
	if (allImgPath.length >= imgMaxNum) {
		allImgPath = shuffle(allImgPath)
		allImgPath.length = imgMaxNum
	}
	return allImgPath
}

var getRandomItem = function () {
    var preItem = null
    return function (arr) {
        var index = Math.floor(Math.random() * arr.length),
            item = arr[index],
            result
        arr = arr.sort(function() {
            return Math.random() > 0.5 ? -1 : 1
        })
        if (preItem != item) {
            result = preItem = item
           } else {
            result = getRandomItem(arr)
        }
        return result
    }
}()

var shuffle = function (arr) {
    var copyArr = arr.slice()
    for (var i = 0; i < copyArr.length; i++) {
        var j = _getRandomNum(0, i)
        var t = copyArr[i]
        copyArr[i] = copyArr[j]
        copyArr[j] = t
    }
    return copyArr
}

function _getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function _genDocfrag() {
	var arrImg = getArrImgPath()
	var docfrag = document.createDocumentFragment()
	arrImg.forEach(function(path) {
        docfrag.appendChild(getPhotoDiv(path))
	})
	return docfrag

	function getPhotoDiv(path) {
		var div = document.createElement('div')
		div.setAttribute('class', 'photo')
		var img = document.createElement('img')
		img.setAttribute('src', path)
		div.appendChild(img)
		return div
	}
}

var setWrapperStyle = function() {
	var wrapperDom = document.querySelector('.wrapper')
	wrapperDom.style.height = window.innerHeight + 'px'
}

var insertPhotoDom = function() {
	var oParent = document.querySelector('.wrapper')
	oParent.appendChild(_genDocfrag())
}

var caclPhotoPositionAndRotate = function() {
	var aPhotoDom = document.querySelectorAll('.photo')
	Array.apply(null, aPhotoDom).forEach(function(dom) {
		var position = _getPosition()
		if (!ONE_BY_ONE) {
			dom.style.left = position.left + 'px'
			dom.style.top = position.top + 'px'
		} else {
			var centerPosition = _getScreenCtenterPosition(dom)
			dom.style.left = centerPosition.left + 'px'
			dom.style.top = centerPosition.top + 'px'
			dom.style.opacity = 0
			dom.__left__ = position.left
			dom.__top__ = position.top
			dom.__rotate__ = 'rotate(' + _getRotate() + 'deg)'
		}
		dom.style.width = getRandomItem(PHOTO_WIDTH) + 'px'
		dom.style.transform = 'rotate(' + _getRotate() + 'deg)'
		dom.style.transition = defaultTransitionStyle()
	})
}

let grantPhoto = async function() {
	let aPhotoDom = document.querySelectorAll('.photo')
	await sleep(1200)
	for (let i = 0; i < aPhotoDom.length; i++) {
		await setPhotoStylePropAndListener(aPhotoDom[i])
		await sleep(500)
	}
	return 'move ok'
}

async function setPhotoStylePropAndListener(dom) {
	return new Promise((resolve, reject) => {
		let s = dom.style
		s.transition = getTimingFunction()
        s.opacity = 1
		s.left = dom.__left__ + 'px'
        s.top = dom.__top__ + 'px'
        s.transform = dom.__rotate__

		dom.addEventListener('transitionend', dom._moveCb = function cb (evt) {
	        if (/left$/.test(evt.propertyName)) {
	            dom.removeEventListener('transitionend', cb)
	            dom._moveCb = null
	            dom.style.transition = defaultTransitionStyle() // 恢复默认css属性
				return resolve()
	        }
        })
	})
}

async function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(() => {
			return resolve()
		}, ms || 1000)
	})
}

function getTimingFunction() {
	var f = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 
	'cubic-bezier(.24,1.13,.94,1.16)', 'cubic-bezier(0,.72,.43,-0.53)', 
	'cubic-bezier(0,1.41,1,-0.63)', 'cubic-bezier(1,-0.13,.15,1.83)', 
	'cubic-bezier(.73,-1.29,0,1.82)', 'cubic-bezier(.91,-1.15,0,1.53)']
	return defaultTransitionStyle(getRandomItem(f), 1.2)
}

function _getScreenCtenterPosition(dom) {
	var domStyle = window.getComputedStyle(dom, null)
	var width = parseInt(domStyle['width'])
	var height = parseInt(domStyle['height'])
	var oWrapper = document.querySelector('.wrapper')
	var wrapperStyle = window.getComputedStyle(oWrapper, null)
	var wrapperWidth = parseInt(wrapperStyle['width'])
	var wrapperHeight = parseInt(wrapperStyle['height'])

	return {
		left: parseInt(wrapperWidth/2 - width/2),
		top: parseInt(wrapperHeight/2 - height/2)
	}
}

function _getPosition () {
	var x = [], y = []
	var xMin, xMax, yMin, yMax
	var xWidth = window.innerWidth * .9
	var dVal = window.innerWidth - xWidth
	xMin = parseInt(dVal / 2)
	xMax = parseInt(xWidth + xMin - _getPhotoDomHeight('middle'))
    for (var i = xMin; i < xMax; i++) {
        x.push(i)
    }
    yMin = TOP_HEIGHT
    yMax = window.innerHeight - _getPhotoDomHeight('middle')
    for (i = yMin; i < yMax; i++) {
        y.push(i)
    }
    return { left: getRandomItem(x), top: getRandomItem(y) }
}

function _getExpectPosition() {
	var position = _getPosition()
	var preLeft = 0, preTop = 0, diff = 10
	while (true) {
		if (
			position.left - preLeft >= diff && 
			position.top - preTop >= diff
		) {
			preLeft = position.left
			preTop = position.top
			break
		} else {
			position = _getPosition()
		}
	}
	return position
}

function _getRotate () {
	var arr = []
	Array.apply(null, { length: 360 }).map(function(item, index) {
		arr.push(index + 1, index * -1 - 1)
	})
	return getRandomItem(arr)
}

function _getPhotoDomHeight(state) {
	var aPhotoDom = document.querySelectorAll('.photo')
	var aHeight = []
	Array.apply(null, aPhotoDom).forEach(function(dom) {
		aHeight.push(parseInt(window.getComputedStyle(dom, null)['height']))
	})
	var min = Math.min.apply(Math, aHeight)
	var max = Math.max.apply(Math, aHeight)
	var middle = parseInt((min + max) / 2)
	return state === 'min' 
	            ? min
	            : state === 'max'
	                ? max
	                : middle
}

var bindEvent = function() {
	var aPhotoDom = document.querySelectorAll('.photo')
	Array.apply(null, aPhotoDom).forEach(function(dom) {
		drag(dom, function() {
			dom.style.transition = mouseDownTransitionStyle
		}, null, function() {
			dom.style.transition = defaultTransitionStyle()
		})
		bindDblclick(dom)
		bindTransitionend(dom)
	})

	function bindDblclick(dom) {
		dom.addEventListener('dblclick', function() {
			dom.style.opacity = 0
			dom.__trigger_dblclick__ = true
		}, false)
	}

	function bindTransitionend(dom) {
		dom.addEventListener('transitionend', function(evt) {
			if (/opacity$/.test(evt.propertyName)) {
				if (dom.__trigger_dblclick__) {
					dom.style.display = 'none'
				}
			}
		}, false)
	}
}

var hiddenLoading = function() {
	var loadDom = document.querySelector('.loading')
	loadDom.style.display = 'none'
}

var setLoadingTipText = function(tip) {
	var loadTipDom = document.querySelector('.loading-tip')
	loadTipDom.innerHTML = tip
}