function parse(data) {
	let arr = createSomeObject(data)
	setVal(arr, data)
	let result = serialize(arr)
	return result

	function createSomeObject(data) {
		let objArr = []
		let arr = data.shift()
		arr.forEach((item, index) => {
			if (index !== 0) {
				objArr.push(createObject(data, arr[index]))
			}
		})
		return objArr
	}

	function createObject(data, fileName) {
		let obj = {}
		data.forEach((arr, index) => {
			obj[arr[0]] = null
		})
		obj['fileName'] = fileName
		return obj
	}

	function setVal(objArr, data) {
		let prop
		data.forEach((arr, index) => {
			arr.forEach((item, idx) => {
				if (idx === 0) {
					prop = item
				} else {
					objArr[idx - 1][prop] = item
				}
			})
		})
		return objArr
	}

	function serialize(arr) {
        let result = []
        arr.forEach((obj, index) => {
			let emptyObject = {}
			emptyObject[obj['fileName']] = obj
			delete obj['fileName']
			result.push(emptyObject)
        })
        return result
	}
}

module.exports = { parse }