function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function searchAbc(page,url,key) {  
  console.log('初始url:' + encodeURI(url + key))

  wx.request({
    url: encodeURI(url + key),

    header: {
      'Content-type': 'application/xml'
    },

    data: {},

    success: function (result) {
      console.log('请求url:' + encodeURI(url + key))
      searchDic(page,result.data)
    },

    fali: function ({ errMsg }) {
      console.log('向服务器请求数据失败fail...' + errMsg)
    },

    complete: function () {
      console.log('向服务器请求数据完成complete')
    }
  })
}

function searchDic(page,searchKey)  {
  console.log('向服务器请求数据成功' + searchKey)
  var parser = require("../lib/xmldom/dom-parser")
  var xmlParser = new parser.DOMParser()
  var dictionaryDoc = xmlParser.parseFromString(searchKey)

  var entryNodes = new Array()
  var entryItems = new Array();
  var entryIndex = 0
  entryNodes = dictionaryDoc.getElementsByTagName('entry')
  console.log('entryNodes' + entryNodes)

  for (var ii = 0; ii < entryNodes.length; ii++) {

    var entryChildren = filteNull(entryNodes[ii].childNodes, '')

    var keys = filteNull(entryChildren[0].childNodes, 'key') //key 的集合
    var descriptions = filteNull(entryChildren[1].childNodes, 'description');//description 的集合

    var key = ""
    var description = ""

    for (var i in keys) {
      var entryItem = new Object()
      entryItem.key = turnLanguageName(keys[i].attributes[0].value) + keys[i].textContent
      entryItem.description = descriptions[i].textContent
      entryItems[entryIndex] = entryItem
      console.log("entryIndex = " + entryIndex)
      entryIndex++
    }
  }
  for (var i in entryItems) {
    console.log(entryItems[i].key + "-----" + entryItems[i].description)
  }

  page.setData({
    entryItems: entryItems
  })
}

/*
 * 去掉浏览器为空格换行符等自动增加的多余节点
*/
function filteNull(nodeList, xmlElementName) {
  var newNodeList = new Array()
  var j = 0
  for (var i in nodeList) {
    var nodeStr = nodeList[i] + ""
    if (nodeStr.indexOf("<" + xmlElementName) >= 0 && nodeStr.indexOf("toString") < 0) {
      newNodeList[j] = nodeList[i]
      j++;
    }
  }
  return newNodeList
}

/**
 * 各种语言转换成可读性的文字
 */
function turnLanguageName(languageKey){
  var languageName = ""
  if (languageKey == "chinese")
    return "【中文】"
  else if (languageKey == "japanese")
    return "【日本語】"
  else if (languageKey == "english")
    return "【English】"
  else
    return ""
}

module.exports = {
  formatTime: formatTime
}

module.exports = {
  searchAbc: searchAbc
}