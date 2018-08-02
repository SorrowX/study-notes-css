function preloadImg(arrPath, cb) {
	var successNum = 0

	for (var i = 0; i < arrPath.length; i++) {
	    var img = new Image()
	    img.src = arrPath[i]
	    img.onload = function() {
			handlerLoad(this)
	    }

	    img.onerror = function(err) {
	    	handlerError(err, this)
	    }
	}

	function handlerLoad(dom) {
		++successNum
		if (successNum === arrPath.length) {
			cb(null, 'success')
		} else {
			cb(null, (Math.ceil(successNum/arrPath.length) * 100 ) + '%') 
		}
	}

	function handlerError(err) {
		cb(err)
	}
}