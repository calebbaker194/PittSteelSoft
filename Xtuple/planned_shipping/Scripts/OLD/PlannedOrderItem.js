debugger;
var _save = mywindow.findChild("_save");
var _cust = mywindow.findChild("_cust");
var _item = mywindow.findChild("_item");
var _qty = mywindow.findChild("_qty");
var _psNumber = mywindow.findChild("_psNumber");
var _total =mywindow.findChild("_total");
var _totalHead;
var _lineNumber=mywindow.findChild("_lineNumber");
var _uom=mywindow.findChild("_uom");
var params=new Object();

_uom.append(1,'LB');
_uom.append(2,'EA');

set = function(input)
{
   params.plannedshiphead_id = input.id;
   params.plannedshiphead_number=input.plannedshiphead_number;
   params.lineitem=input.lineitem
   _psNumber.text=params.plannedshiphead_number;
   _total.text=input.total_weight;
   _totalHead=_total.text;
   _lineNumber.text=input.lineitem;
}

function getParams()
{
   
   params.cust_id=_cust.id();
   params.item_id=_item.id();
   params.qty=_qty.text;
   params.uom=_uom.code;  

   //to set line_id
   var line_id_qry=toolbox.executeQuery("SELECT max(plannedshipitem_id)+1 AS id FROM plannedshipitem")

   if(line_id_qry.first())
   {
      params.lineitem_id=(line_id_qry.value("id"));
   }

 
   return params;
}

function saveLine()
{  

   toolbox.executeQuery("INSERT INTO plannedshipitem VALUES(<? value('lineitem_id')?>,<? value('plannedshiphead_id')?>,<? value('item_id')?>,<? value('qty')?>,<? value('lineitem')?>,<? value('cust_id')?>,<? value('uom')?>)",getParams());

   _cust.setId(-1);
   _item.setId(-1);
   _qty.text='';
   _uom.setId(-1);
   params.lineitem=params.lineitem+1;
   _lineNumber.text=params.lineitem;

   var weightTotalQry=toolbox.executeDbQuery("PlannedLoad","PlannedLoadWeight",{plannedshiphead_id :params.plannedshiphead_id})

   if(weightTotalQry.first())
   {
      _totalHead=weightTotalQry.value("weight")
   }
   sumQty();
}

function sumQty()
{
   _total.text=(Number(_totalHead)+Number(_qty.text));
}

_qty.textChanged.connect(sumQty);
_save.clicked.connect(saveLine);