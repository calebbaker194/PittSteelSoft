//Calculator for LB's To Each peice conversion 

var _item=mywindow.findChild("_item");
var _conv;

function getConversion()
{ 
   debugger;
   _item.newId.disconnect(getConversion);
   var _params=new Object();
   _params.item_id=mywindow.findChild("_item").id();
   
   var _qry=toolbox.executeQuery("SELECT CASE WHEN item_inv_uom_id=4 THEN itemuomtouom(<?value('item_id')?>,item_inv_uom_id,7,100) ELSE itemuomtouom(<?value('item_id')?>,item_inv_uom_id,4,100)END AS conv FROM item WHERE item_id=<?value('item_id')?>",_params)
   
   if(_qry.first())
   {
      _conv=_qry.value("conv")
      calculator();
   }
   else
      _conv=-1;
}


function calculator()
{
var _shippingUOM=mywindow.findChild("_shippingUOM");
var _layout=toolbox.widgetGetLayout(_shippingUOM);
var _qtyToIssue=mywindow.findChild("_qtyToIssue")

var _uomLabel=toolbox.createWidget("QLabel",mywindow,"_uomLabel");
_uomLabel.text="UOM";
_layout.addWidget(_uomLabel,5,2);

var _uomCovertLabel=toolbox.createWidget("QLabel",mywindow,"_uomCovertLabel");
_uomCovertLabel.text="Quantity";
_layout.addWidget(_uomCovertLabel,5,3);

var _LBlbl=toolbox.createWidget("QLabel",mywindow,"_LBlbl");
_LBlbl.text="LB";
var _EAlbl=toolbox.createWidget("QLabel",mywindow,"_EAlbl");
_EAlbl.text="EA";
_layout.addWidget(_LBlbl,6,2);
_layout.addWidget(_EAlbl,7,2);

var _LBLn=toolbox.createWidget("QLineEdit",mywindow,"_LBLn");
var _EALn=toolbox.createWidget("QLineEdit",mywindow,"_EALn");
_layout.addWidget(_LBLn,6,3);
_layout.addWidget(_EALn,7,3);

var _item=mywindow.findChild("_item");

function updateqtyLB(input)
{
   _EALn.textChanged.disconnect(updateqtyEA);

   var _tqry=toolbox.executeQuery("SELECT itemuomtouom("+_item.id()+",4,7,"+_LBLn.text+") AS weight");
   if(_tqry.first())
      _EALn.text=_tqry.value("weight");
   
   if(_shippingUOM.text=="EA")
   {
      _qtyToIssue.text=Math.round(parseFloat(_EALn.text));
   }
   else
   {
      _qtyToIssue.text=(parseFloat(_LBLn.text));
   } 
   _EALn.textChanged.connect(updateqtyEA);
}

function updateqtyEA(input)
{
   _LBLn.textChanged.disconnect(updateqtyLB);

   var _tqry=toolbox.executeQuery("SELECT itemuomtouom("+_item.id()+",7,4,"+_EALn.text+") AS weight");
   if(_tqry.first())
      _LBLn.text=_tqry.value("weight");

   if(_shippingUOM.text=="EA")
   {
      _qtyToIssue.text=Math.round(parseFloat(_EALn.text));
   }
   else
   {
      _qtyToIssue.text=parseFloat(_LBLn.text);
   }
   _LBLn.textChanged.connect(updateqtyLB); 
}

_LBLn.textChanged.connect(updateqtyLB);
_EALn.textChanged.connect(updateqtyEA);
}
_item.newId.connect(getConversion);