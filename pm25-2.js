
var request = require("request");
var fs = require("fs");
var index = 0;

function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}


var pm25 = function() {
  request({
    url: "https://taqm.epa.gov.tw/taqm/aqs.ashx?lang=tw&act=aqi-epa&ts=1510540242239",
    method: "GET"
  }, function(error, response, body) {
    if (error || !body) {
    	console.log('error');
      return;
    }
	var result = [];
	var dataString = "";
	var items = JSON.parse(body).Data;
	index += 1;
	dataString = "地點,PM2.5,時間\n";

	for (i=0;i<items.length ; i++)
	{
	    dataString = dataString+ items[i]["SiteName"] + ','+ String(items[i]["PM25"]) + ','+ items[i]["Time"] +"\n"
		result.push(items[i])		
	}
	filename = "PM25_"+items[0]["Time"].substring(items[0]["Time"].length-8,items[0]["Time"].length-3).replace(":","")+".csv"
	console.log(filename);
		fs.writeFile(filename, dataString,'utf-8', function() {

 		var varTime = new Date();
 		console.log('------------------------------------------------------------------------');
 		for (var j = 0; j < result.length; j++) {
		    var data = result[j];
			console.log(data.SiteName + ', PM2.5: '+ data.PM25 +' ( Time: '+ items[0]["Time"] + ')');
		}
		console.log("finish  "+index+" !!");
	});
  });
};
pm25();
setInterval(pm25,60*1000);   // 1 min refresh