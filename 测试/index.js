const fu = require('./fu')
const path = require('path')

const FILE_SUFFIX = '.json'
const resolve = p => path.resolve(__dirname, '../', p)
let FILE_PATH = resolve('./')
console.log('FILE_PATH: ', FILE_PATH)

function genFile(arr) {
	arr.forEach((obj) => {
		let keys = Object.keys(obj)
		let key = keys[0]
		let jsonStr = JSON.stringify(obj[key])
		createFile(key, jsonStrs)
	})
}

function createFile(fileName, fileContent) {
	fileName = fileName + FILE_SUFFIX
	let filePath = FILE_PATH + fileName
	// fu.touch(filePath) //创建文件
	console.log(filePath, fileContent)
    fu.write(filePath, fileContent) //写入内容
}

module.exports = { genFile }