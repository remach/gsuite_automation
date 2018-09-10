var DEP_LIST={}
var LOC_LIST={}

function myFunction() {
    testGET();
}

function doGet(e) {
    if (e.parameter.action && e.parameter.action == 'add') {
        //return HtmlService.createHtmlOutput(parseList(e.parameter)).setMimeType(ContentService.MimeType.JSON)
        return ContentService.createTextOutput(parseList(e.parameter))
            .setMimeType(ContentService.MimeType.JSON);
    }
    if (e.parameter.action && e.parameter.action == 'getLocationsList') {
        return ContentService.createTextOutput(JSON.stringify(getLocationsList()))
            .setMimeType(ContentService.MimeType.JSON);
    }
    if (e.parameter.action && e.parameter.action == 'getDepartmentsList') {
        return ContentService.createTextOutput(JSON.stringify(getDepartmentsList()))
            .setMimeType(ContentService.MimeType.JSON);
    }
    if (e.parameter.action && e.parameter.action == 'getResourceByDepartment') {
        return HtmlService.createHtmlOutput(getResourceByDepartment());
    }
    else {
        return ContentService.createTextOutput("No action param in URL. Valid valuses: getResourceByDepartment, getDepartmentsList, getLocationsList, add");
    }

};


function getResourceByDepartment() {
    var res = "";
    for each( var dep in getDepartmentsList() ) {
      res += '<tr><td>' + dep + '</td><td>'+parseList({ "location": "{location}", "department": dep })+'</td></tr>';
        continue
        for  each( var loc in getLocationsList() ) {
            res += '<h4>' + dep + ":" + loc + '</h4><ul>';
            for each( var r in parseList({ "location": loc, "department": dep }).split(","))
            res += '<li>' + r + '</li>'
            res += '</ul>'
        }
    }
    return "<table>"+res+"</table>";
}



function parseList(p) {
    for (var k in p) {
        p[k] = p[k].toString().toLowerCase()
    }
  fillDepFromFile ()
  fillLocFromFile()
  res= [DEP_LIST[p.department].replace(new RegExp('{location}', 'g'), p.location),LOC_LIST[p.location]];
  Logger.log(res)
  return res.join(",")
}

function getDepartmentsList() {
  
  var d = fillDepFromFile ()
  var res= {}
  var arr=[]
  for (var a in DEP_LIST)
    if (a !== "" ) arr.push({'name':a})
    res["departments"]=arr
  return res;
   
}

function getLocationsList() {
  var d = fillLocFromFile ()
  var res={}
  var arr=[]
  for (var a in LOC_LIST)
    if (a !== "" ) arr.push({'name':a})
    res["locations"]=arr
  return res;
}

function fillDepFromFile (){
  var data = SpreadsheetApp
      .openById(FILE_ID)
      .getSheetByName('DEPS')
      .getDataRange()
      .getValues();
  DEP_LIST={}
    for (var i = 1; i < data.length; i++)
      DEP_LIST[data[i][0]]=data[i][1]
      Logger.log(DEP_LIST);
  return DEP_LIST
}

function fillLocFromFile (){
  var data = SpreadsheetApp
      .openById(FILE_ID)
      .getSheetByName('LOCATION')
      .getDataRange()
      .getValues();
  LOC_LIST={}
    for (var i = 1; i < data.length; i++)
      LOC_LIST[data[i][0]]=data[i][1]
      Logger.log(LOC_LIST);
  return LOC_LIST
}


function testGET() {
    // example url
    var queryString = "action=add&t1itle=Director&location=Moscow&department=Sales QA&area=Russia&typeofemployee=freelance&dom1ain=exante.eu";
    //var queryString = "action=getLocationsList";
    // var queryString = "action=getDepartmentsList";
    var map = {}
    map.parameter = {}
    //fill new array
    for each(var kv in queryString.split('&')) {
        var k = kv.split('=')[0], v = kv.split('=')[1];
        map.parameter[k] = v;
    }
    Logger.log('Test map %s.', map);
    Logger.log(parseList(map.parameter));
    //  Logger.log(getLocationsList());
    //  Logger.log(getDepartmentsList());
    //  Logger.log(getResourceByDepartment());




}
