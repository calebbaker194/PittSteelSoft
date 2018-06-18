debugger;
var _new = mywindow.findChild("_new");
var _notes = mywindow.findChild("_notes");
var _shipmentNumber=mywindow.findChild("_ShipmentNumberLabel");
var _save=mywindow.findChild("_save");
var _shipdate=mywindow.findChild("_shipDate");
var _driver=mywindow.findChild("_driver");
var _totalWeight=mywindow.findChild("_totalWeight");
var _plannedshipitem=mywindow.findChild("_plannedshipitem");
var childwnd;
var _this=this;
var _primaryKey;
var _lineItem;
var _close = mywindow.findChild("_close");

_plannedshipitem.addColumn(qsTr("Line#"),-1,1,true,"lineitem");
_plannedshipitem.addColumn(qsTr("Item#"),-1,1,true,"itemNum");
_plannedshipitem.addColumn(qsTr("Description"),-1,1,true,"descrip");
_plannedshipitem.addColumn(qsTr("Weight"),-1,1,true,"weight");
_plannedshipitem.addColumn(qsTr("Customer"),-1,1,true,"customer");

var _primaryKeyQuery=toolbox.executeQuery("SELECT ( COUNT(*)+1) AS primk FROM plannedshiphead");

if(_primaryKeyQuery.first())
{
   _primaryKey=_primaryKeyQuery.value("primk");
   _shipmentNumber.text = (_primaryKey+10000);

   var _insert=toolbox.executeQuery("INSERT INTO plannedshiphead (plannedshiphead_id,plannedshiphead_number)VALUES(<? value(cnum1)?>,<? value(cnum2) ?>)",{cnum1 : _primaryKey,cnum2 : _shipmentNumber.text});

}

function nextLineNumber()
{
   var _lineItemQuery=toolbox.executeQuery("SELECT ( COUNT(*)+1) AS linenum FROM plannedshipitem WHERE plannedshipitem_plannedshiphead_id=<? value('cnum')?>",{cnum : _primaryKey});

   if(_lineItemQuery.first())
   {
      _lineItem=_lineItemQuery.value("linenum");
   }
}

function newLine()
{
   nextLineNumber();
   childwnd = toolbox.openWindow("PlannedOrderItem",mywindow,0,1);
   var params=new Object();
   params.id=_primaryKey;
   params.plannedshiphead_number=_shipmentNumber.text;
   params.updateLine=updateLine;
   params.lineitem=_lineItem;
   params.total_weight=_totalWeight.text;
   childwnd.destroyed.connect(updateLine);
   var tmp = toolbox.lastWindow().set(params);
   var execval = childwnd.exec();
}

function updateLine()
{
   var lineupdateqry=toolbox.executeDbQuery("PlannedLoad","ListPlannedLoadItems",{plannedshiphead_id : _primaryKey});
   _plannedshipitem.populate(lineupdateqry,true);

   var weightTotalQry=toolbox.executeDbQuery("PlannedLoad","PlannedLoadWeight",{plannedshiphead_id :_primaryKey})

   if(weightTotalQry.first())
   {
      _totalWeight=weightTotalQry.value("weight")
   }

}

function cancle()
{
   var params=new Object();
   params.id=_primaryKey;
   toolbox.executeDbQuery("PlannedLoad","DeletePlannedLoad",params);
}

function save()
{
   var params=new Object();
   params.id=_primaryKey;
   params.shipdate=_shipdate.toISOString();
   params.driver=_driver.text;

   toolbox.executeQuery("UPDATE plannedshiphead SET plannedshiphead_driver=<? value('driver')?>,plannedshiphead_datetoship=date( <? value(shipdate)?>) WHERE plannedshiphead_id=<? value(id)?>" ,params);
   
}
mywindow.findChild("_refresh").clicked.connect(updateLine);
_save.clicked.connect(save);
_new.clicked.connect(newLine);
_close.clicked.connect(cancle);