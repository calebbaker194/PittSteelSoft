//First LB to EA Calculator

var _wo=mywindow.findChild("_wo");
var _item=mywindow.findChild("_item");

////IF YOUR TRYING TO EDIT THIS ITS PROBABLY BETTER TO REDO IT

function getConversion()
{ 
 _wo.newId.disconnect(getConversion);
   
   var _params=new Object();
   _params.wo_id=_wo.id();

      calculator();
}


function calculator()
{


var _productionUOM=_wo.findChild("_uom").text

var _mylayout=toolbox.widgetGetLayout(mywindow.findChild("_productionNotes"));

var _qtyToIssue=mywindow.findChild("_qty");

//CREATE WIDGETS AND FORMAT

var _layout=toolbox.createLayout("QHBoxLayout",mywindow,"_layout");
  _mylayout.insertLayout(0,_layout,0);

var _uomCovertLabel=toolbox.createWidget("QLabel",mywindow,"_uomCovertLabel");
_uomCovertLabel.text="Quantity: ";

var _LBlbl=toolbox.createWidget("QLabel",mywindow,"_LBlbl");
_LBlbl.text="-LB ";
var _EAlbl=toolbox.createWidget("QLabel",mywindow,"_EAlbl");
_EAlbl.text="-EA";


var _LBLn=toolbox.createWidget("QLineEdit",mywindow,"_LBLn");
var _EALn=toolbox.createWidget("QLineEdit",mywindow,"_EALn");

///ADD WIDGETS AND SPACING

_layout.addWidget(_uomCovertLabel);
_layout.addWidget(_LBLn);
_layout.addWidget(_LBlbl);
_layout.addWidget(_EALn);
_layout.addWidget(_EAlbl);


_layout.addSpacing(250)
_mylayout.insertSpacing(1,30)
////

function updateqtyLB(input)
{
   _EALn.textChanged.disconnect(updateqtyEA);

   var _tqry=toolbox.executeQuery("SELECT itemuomtouom(item_id,4,7,"+_LBLn.text+") AS weight FROM wo JOIN itemsite ON(wo_itemsite_id=itemsite_id) JOIN item ON(itemsite_item_id=item_id) WHERE wo_id=<?value('wo_id')?>",{"wo_id":_wo.id()});
   
   if(_tqry.first())
   {
    _EALn.text=_tqry.value("weight");
    if(_wo.findChild("_uom").text=="LB")
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

   var _tqry=toolbox.executeQuery("SELECT itemuomtouom(item_id,7,4,"+_EALn.text+") AS weight FROM wo JOIN itemsite ON(wo_itemsite_id=itemsite_id) JOIN item ON(itemsite_item_id=item_id) WHERE wo_id=<?value('wo_id')?>",{"wo_id":_wo.id()});

   if(_tqry.first())
   {
    _LBLn.text=_tqry.value("weight");
	
    if(_wo.findChild("_uom").text=="LB")
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

_LBLn.textChanged.connect(updateqtyLB);
_EALn.textChanged.connect(updateqtyEA);
}
_wo.newId.connect(getConversion);