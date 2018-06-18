debugger
var _save=mywindow.findChild("_save");
var _cancel=mywindow.findChild("_cancel");
var _weightFilter=mywindow.findChild("_weightFilter");
var _salesOrder=mywindow.findChild("_salesOrder");
var _cust=mywindow.findChild("_cust");
var _weightTotal=mywindow.findChild("_totalWeight");
var _loadItems=mywindow.findChild("_loadItems");
var _logItems=mywindow.findChild("_logItems");
var _print=mywindow.findChild("_print");
var _loadNumber=mywindow.findChild("_loadNumber");
var _removeItem=mywindow.findChild("_removeItem");
var _addItem=mywindow.findChild("_addItem");
var _date=mywindow.findChild("_shipDate");
var _driver=mywindow.findChild("_driver");
var _loadNumber=mywindow.findChild("_loadNumber");
var _addPartial=mywindow.findChild("_addPartial");
var _allItems=mywindow.findChild("_allItems");


var _params=new Object();
var _edit=false;


_loadItems.addColumn(qsTr("SO#"),-1,2,"salesorder");
_loadItems.addColumn(qsTr("coitemid"),-1,2,"coitemid");
_loadItems.addColumn(qsTr("Customer"),-1,1,"customer");
_loadItems.addColumn(qsTr("Details"),-1,1,"descrip");
_loadItems.addColumn(qsTr("Weight"),-1,2,"weight");
_loadItems.addColumn(qsTr("Shipped"),-1,2,"shipped");

_logItems.addColumn(qsTr("SO#"),-1,2,"salesorder");
_logItems.addColumn(qsTr("coitemid"),-1,2,"coitemid");
_logItems.addColumn(qsTr("Customer"),-1,1,"customer");
_logItems.addColumn(qsTr("Details"),-1,1,"descrip");
_logItems.addColumn(qsTr("Weight"),-1,2,"weight");
_logItems.addColumn(qsTr("Ordered"),-1,2,"qty");

_logItems.hideColumn(1);
_loadItems.hideColumn(1);

set=function(input)
{
   _params.plannedshiphead_id=input.plannedshiphead_id;
   _params.plannedshiphead_number=input.plannedshiphead_number;
   _edit=input.edit;
   if(_edit==false)
   {
      toolbox.executeQuery("INSERT INTO plannedshiphead(plannedshiphead_id,plannedshiphead_number) VALUES(<? value('plannedshiphead_id')?>,<?value('plannedshiphead_number')?>)",_params);
   }
   else
   {
      _driver.text=input.driver;
      _date.setDate(input.date);
   }
  _loadNumber.text=_params.plannedshiphead_number;

  updateWindows();
  nextLine();
}

function save()
{
   _params.date=_date.toISOString();
   _params.driver=_driver.text;

   toolbox.executeQuery("UPDATE plannedshiphead SET plannedshiphead_datetoship= <?value('date')?>,plannedshiphead_driver=<?value('driver')?> WHERE plannedshiphead_id=<? value('plannedshiphead_id')?>",_params)
}

function cancel()
{
   if(_edit==false)
   {
      toolbox.executeQuery("DELETE FROM plannedshiphead WHERE plannedshiphead_id=<? value('plannedshiphead_id')?>",_params)
   }
   mywindow.close();
}

function print()
{
   
}

function addItem()
{
   _params.coitem_id=_logItems.currentItem().data(1,0);
   toolbox.executeDbQuery("PlannedLoad","InsertShipItems",_params)


   nextLine();
   updateWindows();	
}
function addPartial()
{
   debugger;
}


function removeItem()
{
   _params.coitem_id=_loadItems.currentItem().data(1,0);	
   toolbox.executeQuery("DELETE FROM plannedshipitem WHERE plannedshipitem_coitem_id=<? value('coitem_id')?>",_params);
 
   nextLine();
   updateWindows();
}

function getFilters()
{
   var _filterParams = new Object();
    _filterParams.plannedshiphead_id=_params.plannedshiphead_id;
   
   if(_salesOrder.text!='')
   {
      _filterParams.cohead_number=_salesOrder.text;
   }

   if(_weightFilter.text!='')
   {
      _filterParams.maxWeight=_weightFilter.text;
   }
   
   if(_cust.id()!=-1)
   {
      _filterParams.cust_id=_cust.id();
   }  
   //if()
   //{
   
   //}
   return _filterParams;
}

function updateWindows()
{
   
   var _logQry=toolbox.executeDbQuery("PlannedLoad","logquery",getFilters());
   var _loadQry=toolbox.executeDbQuery("PlannedLoad","loadquery",_params);
   if(_params.plannedshiphead_id>-1)
   {
      var _weightQry=toolbox.executeQuery("SELECT sum(coitem_qtyord*item_prodweight*coitem_qty_invuomratio)AS weight FROM coitem JOIN cohead ON(coitem_cohead_id=cohead_id)JOIN itemsite ON(coitem_itemsite_id=itemsite_id)JOIN item ON(itemsite_item_id=item_id) JOIN plannedshipitem ON(plannedshipitem_coitem_id=coitem_id)JOIN plannedshiphead ON(plannedshipitem_plannedshiphead_id=plannedshiphead_id) WHERE plannedshiphead_id=<? value('plannedshiphead_id')?>",_params);
   
     if(_weightQry.first())
      {
         _weightTotal.text=_weightQry.value("weight");
      }
   }
   _loadItems.populate(_loadQry);
   _logItems.populate(_logQry);
}


function nextLine()
{
   var _lineIDQry=toolbox.executeQuery("SELECT max(plannedshipitem_id)+1 AS lineid FROM plannedshipitem");
   var _lineNumQry=toolbox.executeQuery("SELECT count(plannedshipitem_lineitem)+1 AS linenum FROM plannedshipitem WHERE plannedshipitem_plannedshiphead_id=<? value('plannedshiphead_id')?>",_params);

   if(_lineIDQry.first())
   {
      _params.plannedshipitem_id=_lineIDQry.value("lineid");
   }
   if(_lineNumQry.first())
   {
      _params.plannedshipitem_lineitem=_lineNumQry.value("linenum");
   }
}

_weightFilter.editingFinished.connect(updateWindows);
_salesOrder.textChanged.connect(updateWindows);
_save.clicked.connect(save);
_cancel.clicked.connect(cancel);
_print.clicked.connect(print);
_addItem.clicked.connect(addItem);
_removeItem.clicked.connect(removeItem);
_addPartial.clicked.connect(addPartial);