debugger;
var _close=mywindow.findChild("_close");
var _print=mywindow.findChild("_print");
var _printAll=mywindow.findChild("_printAll");
var _results=mywindow.findChild("_results");
var _shipment=mywindow.findChild("_shipment");
var _copies=mywindow.findChild("_copies");
var _add=mywindow.findChild("_add");
var _sub=mywindow.findChild("_sub");
var _orderType=""

_results.addColumn(qsTr("Order Type"),-1,1,true,"orderType")
_results.addColumn(qsTr("SO/T0#"),-1,1,true,"salesorder");
_results.addColumn(qsTr("shipitemid"),-1,1,false,"shipitemid");
_results.addColumn(qsTr("Item"),-1,1,true,"itemnum");
_results.addColumn(qsTr("Description"),-1,1,true,"descrip");
_results.addColumn(qsTr("Quantity To Ship "),-1,1,true,"qty");
_results.addColumn(qsTr("labels "),-1,1,true,"label");
_results.addColumn(qsTr("order item id"),-1,1,false,"orderitemid")
var _params;

set=function(input)
{
   _shipment.setId(input.shiphead_id);
}

function newShipment()
{
  _params=new Object();
  _params.shiphead_id=_shipment.id();
  
  var _typeQry = toolbox.executeQuery("SELECT shiphead_order_type AS orderType FROM shiphead  WHERE shiphead_id = <?value('shipment_id')?>",{"shipment_id":_shipment.id()})
  if(_typeQry.first())
  {
    _orderType=_typeQry.value("orderType");
    _params.orderType=_orderType;
  }
   
  var _qry=toolbox.executeDbQuery("ShippingLabels","ShippingLabels",_params);
  _results.populate(_qry);
}
function print()
{
   
   debugger;
   var item=_results.currentItem();
   var printParams = new Object();
   printParams.orderitem_id = item.data(7,0);
   printParams.shipitem_id = item.data(2,0);
      if(item){
   toolbox.printReportCopies("ShipmentLabels",printParams,item.data(6,0));
   }
   
}
function printAll()
{
   var printParams = new Object();
   for(x=1;x<=_results.topLevelItemCount;x++)
   {
      _results.setId(x);
       var item=_results.currentItem();
      
      printParams.orderitem_id = item.data(7,0);
      printParams.shipitem_id = item.data(2,0);
      toolbox.printReportCopies("ShipmentLabels",printParams,item.data(6,0));
   }
}
function editLabel()
{
   var _text = toolbox.createWidget("QLineEdit",mywindow,"_text");
   var _layout=toolbox.widgetGetLayout(_results)
   _layout.addWidget(_text,1,1);
   _layout.removeWidget(_text);
}
function add()
{
  var _item=_results.currentItem();
  _item.setData(6,0,parseInt(_item.data(6,0))+1)
}
function subtrct()
{
   var _item=_results.currentItem();
  _item.setData(6,0,parseInt(_item.data(6,0))-1)
}

_results.doubleClicked.connect(editLabel)
_shipment.newId.connect(newShipment);
_close.clicked.connect(mywindow.close);
_add.clicked.connect(add);
_sub.clicked.connect(subtrct);
_print.clicked.connect(print);
_printAll.clicked.connect(printAll);