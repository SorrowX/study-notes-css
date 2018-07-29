const path = require('path')
const fu = require('./util/fu')

const resolve = p => path.resolve(__dirname, '../', p)
const imgPath = resolve('images')
const jsPath = resolve('js')

function getAllImgPath() {
	let arrPath = []
    fu.each(imgPath, function(item) {
        if (item.directory === false) {
        	arrPath.push(item.name)
        } 
    }, {
    	sync: true,
    	matchFunction: function(item){
    	    return item.name.match(/\.jpg$/i);
    	}
    })
    return arrPath
}

function genDataJS() {
	let fileName = 'data.js'
	let data = `var allImgPath = ${JSON.stringify(getAllImgPath(), null, 4)}`
	fu.write(jsPath + '/' + fileName, data)
	console.log('data.js文件生成完毕!')
}

genDataJS()

