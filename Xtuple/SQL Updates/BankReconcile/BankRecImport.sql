INSERT INTO script(
             script_name, script_order, script_enabled, script_source, 
            script_notes)
    VALUES (reconcileBankaccount, 5, true,'//Made CWB 6/15/18
//caleb.baker194@gmail.com
//

var _checks=mywindow.findChild("_checks");
var _receipts=mywindow.findChild("_receipts");
var _docNumber = -1;
var _amount = -1;
var _postDate = -1;
var _reference = -1;
var _data="";
var _nonRecon="";

function sExport(){
  var _fileName=toolbox.fileDialog(mywindow,"Export CSV","C:/","*.csv",4,1);
  toolbox.textStreamWrite(_fileName,_nonRecon);
}

function sImport(){
  
  var _fileName=toolbox.fileDialog(mywindow,"Import CSV","C:/","*.csv",1,2);
  if(!toolbox.fileExists(_fileName))
    return;
  var _file = toolbox.textStreamRead(_fileName);//Choose File
  _data=CSVToArray(_file,",") //Convert File to Array.
  for(var x=0;x<_data[0].length;x++)
  {
    if(_data[0][x]=="Additional Reference")
      _docNumber=x;
    else if(_data[0][x]=="Amount")
      _amount=x;
    else if(_data[0][x]=="Post Date")
      _postDate=x;
    else if(_data[0][x]=="Reference")
      _reference=x;
  }
  if(!(_docNumber == -1 || _amount == -1))
  {
    parseData();
  }
  else
  {
    QMessageBox.critical(mywindow, "reconcileBankaccount","Import Failed:"+ 
    "_docNumber or _amount not set"+
    "Values Are "+_docNumber+" And "+_amount+" Respectivly");
  }
}

function CSVToArray( strData, strDelimiter ){
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    (
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
    );


  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;


  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec( strData )){

    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[ 1 ];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (
    strMatchedDelimiter.length &&
    strMatchedDelimiter !== strDelimiter
    ){

    // Since we have reached a new row of data,
    // add an empty row to our data array.
    arrData.push( [] );

    }

    var strMatchedValue;

    // Now that we have our delimiter out of the way,
    // lets check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[ 2 ]){

    // We found a quoted value. When we capture
    // this value, unescape any double quotes.
    strMatchedValue = arrMatches[ 2 ].replace(
      new RegExp( "\"\"", "g" ),
      "\""
      );

    } else {

    // We found a non-quoted value.
    strMatchedValue = arrMatches[ 3 ];

    }


    // Now that we have our value string, lets add
    // it to the data array.
    arrData[ arrData.length - 1 ].push( strMatchedValue );
  }

  // Return the parsed data.
  return( arrData );
  }

function parseData(){
  var _count=0;
  var _matches=0;
  var _adj=0;
  var _usedLines=[];              //
  for(var z=0;z<_data.length;z++) //
  {                               //////////// To Show Lines Not Used.
    _usedLines.push(z);           //
  }                               //
  
  //////////     Check for items that need to be manually adjusted      /////////////

  for(var y=0;y<_data.length;y++)
  {
    if((_data[y][_reference]=="LN-00000000000009051449EB" || _data[y][_reference]=="LN-00000000000009051449MM") && _data[y][9] == "")
    {
      var _dateQry=toolbox.executeQuery("SELECT CAST(''+_data[y][_postDate]+'' AS DATE) AS _datevar");
      _dateQry.first();
      debugger;
      var _checkAdj = toolbox.executeQuery("SELECT bankadj_id FROM bankadj WHERE bankadj_amount=ABS("+_data[y][_amount]+")")
      if(!_checkAdj.first())
      {
        var _bankAdjustment = toolbox.openWindow("bankAdjustment",mywindow,0,1);
        var Params = new Object();
        Params.mode="new"
        toolbox.lastWindow().set(Params);
         
        var _bankaccnt = _bankAdjustment.findChild("_bankaccnt");//
        var _bankadjtype = _bankAdjustment.findChild("_bankadjtype");
        var _bankadjdate = _bankAdjustment.findChild("_date");//
        var _bankadjamount = _bankAdjustment.findChild("_amount");//
     
        _bankaccnt.currentIndex=1;
        if(_data[y][_reference]=="LN-00000000000009051449EB")
          _bankadjtype.currentIndex=4;
        else if(_data[y][_reference]=="LN-00000000000009051449MM")
          _bankadjtype.currentIndex=3;
        
        if(_dateQry.first())
          _bankadjdate.setDate(_dateQry.value("_datevar"));
        if(_data[y][_amount]>0)
          _bankadjamount.baseValue=_data[y][_amount];
        else
          _bankadjamount.baseValue=-1*_data[y][_amount];
        _bankAdjustment.sSave();
        _adj++;
      }
    }
  }
  debugger;
  var _citems = _checks.findItems(".+",4);  
  //////////     Cycle Through Items In the _checks XTreeWidget      /////////////
  for(var y=0;y<_citems.length;y++)
  {
    for(var x=1;x<_data.length;x++)
    {
      if(_data[x][_amount]<0)
      {
        if((_citems[y].text(3) == _data[x][_docNumber] || _citems[y].text(2) == "ADJ") && _citems[y].text(8).replace(",","") == (_data[x][_amount]*-1))
        {
          _usedLines.splice(_usedLines.indexOf(x),1);
          if(_citems[y].text(0)=="Yes")
          {
            _matches++;
            break;
          }
          _checks.setCurrentItem(_citems[y]);
          mywindow.sChecksToggleCleared();
          _citems = _checks.findItems(".+",4);
          _count++;
          break;
        }
      }
    }
  }
  
  var _ritems = _receipts.findItems(".+",4);
  //////////     Cycle Through Items In the _receipts XTreeWidget      /////////////
  for(var y=0;y<_ritems.length;y++)
  {
    for(var x=1;x<_data.length;x++)
    {
      if(_data[x][_amount]>0)
      {
        if(_ritems[y].text(8).replace(",","") == _data[x][_amount])
        {
          _usedLines.splice(_usedLines.indexOf(x),1);
          if(_ritems[y].text(0)=="Yes")
          {
            _matches++;
            break;
          }
          _receipts.setCurrentItem(_ritems[y]);
          mywindow.sReceiptsToggleCleared();
          _count++;
          _ritems = _receipts.findItems(".+",4);
          break;
        }
      }
    }
  }
  _nonRecon="";  
  var _line="";
  for(var z=0;z<_usedLines.length;z++)
  {
    _line="";
    for(var a=0;a<_data[0].length;a++)
    {
      _line = _line+","+_data[_usedLines[z]][a];
    }
    _nonRecon = _nonRecon + _line.slice(1)+"\n";
  }

  QMessageBox.information(mywindow, "reconcileBankaccount","Successful Import. \n"+ _count +
  " Records Verified\n " + _matches +" Matches That were not Changed \n"+_adj+" Adjustments Made");

  if(_nonRecon != "")
    showNoMatch(CSVToArray(_nonRecon,","));
  
}

function showNoMatch(_noMatch){
  console.log(_noMatch);
  debugger;
  var _exportWin=toolbox.openWindow("recExportScreen");
  var _exportTree=_exportWin.findChild("_results");
  var _exportBtn=_exportWin.findChild("_export");
  _exportBtn.clicked.connect(sExport);
  _exportTree.setHtml(parseTabel(_noMatch));
}

function parseTabel(_arrData){
  var _text="<table style=''border: 1px solid black;''>\n";
  for(var x=0;x<_arrData.length;x++){
    _text = _text + "<tr>\n";
    for(var y=0;y<_arrData[0].length;y++){
      if(x==0)
        _text = _text + "<th>";
      else
        _text = _text + "<td>";

      _text = _text +_arrData[x][y];
      
      if(x==0)
        _text = _text + "</th>\n";
      else
        _text = _text + "</td>\n";
    }
    _text = _text + "</tr>\n";
  }
  _text = _text + "</table>";
  return _text;
}

debugger;
var _importBtn = toolbox.createWidget("QPushButton",mywindow,"_importBtn");
var _layout = toolbox.widgetGetLayout(mywindow.findChild("_update"));
_importBtn.text="Import";
_layout.insertWidget(4,_importBtn);
_importBtn.clicked.connect(sImport);', 
            'CWB 6/18/2018 TO Add an import feature that automatically makes addjustments then reconciles from a csv');
