//Adds Calculator to a different Area of xtuple

var _uomQty = mywindow.findChild("_uomQty");
var _womatl = mywindow.findChild("_womatl");
var _item=_womatl.id();
var _mylayout=toolbox.widgetGetLayout(_uomQty);
var _qtyToIssue=mywindow.findChild("_qtyToIssue");

var _LBLn=toolbox.createWidget("QLineEdit",mywindow,"_LBLn");
var _EALn=toolbox.createWidget("QLineEdit",mywindow,"_EALn");
	
var _LBlbl=toolbox.createWidget("QLabel",mywindow,"_LBlbl");
_LBlbl.text="-LB ";
var _EAlbl=toolbox.createWidget("QLabel",mywindow,"_EAlbl");
_EAlbl.text="-EA";

var _outerLayout=toolbox.createLayout("QHBoxLayout",mywindow,"_outerLayout");
var _innerLabelLayout=toolbox.createLayout("QVBoxLayout",mywindow,"_innerLabelLayout");
var _innerLineEditLayout=toolbox.createLayout("QVBoxLayout",mywindow,"_innerLineEditLayout");

_outerLayout.insertLayout(0,_innerLabelLayout);
_outerLayout.insertLayout(0,_innerLineEditLayout);
debugger;
_innerLabelLayout.addWidget(_LBlbl);
_innerLabelLayout.addWidget(_EAlbl);

_innerLineEditLayout.addWidget(_LBLn);
_innerLineEditLayout.addWidget(_EALn);

_mylayout.addLayout(_outerLayout,2,3);

if(_uomQty.text == "EA" || _uomQty.text == "LB") 
{
		
}
else //// IF IT DOESNT UNDERSTAND THE UOM WE WANT IT TO REMOVE THE CALCULATOR
{
	removeAll();
}

function removeAll() //TO REMOVE THE CALCULATOR FOR ANY REASON IN THE ENVIRONMENT
{
	_outerLayout.visible=false;
}

function updateqtyLB(input)
{
   _EALn.textChanged.disconnect(updateqtyEA);

   var _tqry=toolbox.executeQuery("SELECT itemuomtouom(item_id,4,7,"+_LBLn.text+") AS weight FROM womatl JOIN itemsite ON(womatl_itemsite_id = itemsite_id) JOIN item ON(itemsite_item_id = item_id) WHERE womatl_id = <?value('womatl_id')?>",{"womatl_id":_womatl.id()});
   
   if(_tqry.first())
   {
    _EALn.text=_tqry.value("weight");
    if(_uomQty.text=="LB")
    {
       _qtyToIssue.text=(parseFloat(_LBLn.text));
    }
    else
    {
       _qtyToIssue.text=(parseFloat(_EALn.text));
    }
   }
   _EALn.textChanged.connect(updateqtyEA);
}

function updateqtyEA(input)
{
   _LBLn.textChanged.disconnect(updateqtyLB);

   var _tqry=toolbox.executeQuery("SELECT itemuomtouom(item_id,7,4,"+_EALn.text+") AS weight FROM womatl JOIN itemsite ON(womatl_itemsite_id = itemsite_id) JOIN item ON(itemsite_item_id = item_id) WHERE womatl_id = <?value('womatl_id')?>",{"womatl_id":_womatl.id()});

   if(_tqry.first())
   {
    _LBLn.text=_tqry.value("weight");
	
    if(_uomQty.text=="LB")
    {
       _qtyToIssue.text=(parseFloat(_LBLn.text));
    }
    else
    {
       _qtyToIssue.text=(parseFloat(_EALn.text));
    }
   }

   _LBLn.textChanged.connect(updateqtyLB); 
}
function setId()
{
   _item=_womatl.id();
}

_LBLn.textChanged.connect(updateqtyLB);
_EALn.textChanged.connect(updateqtyEA);
_womatl.newId.connect(setId);