debugger;

var _results=mywindow.findChild("_results");
var _new=mywindow.findChild("_new");
var _cust=mywindow.findChild("_cust");
var _item=mywindow.findChild("_item");
var _date=mywindow.findChild("_date");
var _delete=mywindow.findChild("_delete");

_results.addColumn(qsTr("Shipment#"),-1,1,true,"Shipment");
_results.addColumn(qsTr("Ship Date"),-1,1,true,"ShipDate");
_results.addColumn(qsTr("Weight"),-1,1,true,"Weight");
_results.addColumn(qsTr("Driver"),-1,1,true,"Driver");

function newLine()
{
   toolbox.openWindow("PlannedOrder");
}

function getParams()
{
    var params=new Object();
    if(_cust.id()!=-1)
    {
	params.cust_id=_cust.id();
    }
    if(_item.id()!=-1)
    {
	params.item_id=_item.id();
    }
    if(_date.isValid())
    {
	params.date=_date.date;
    }

    return params;
}

function query()
{
    try
    {
	var plannedLoads=toolbox.executeDbQuery("PlannedLoad","ListPlannedLoads",getParams());
	_results.populate(plannedLoads,true);
    }catch(e){}
}
function del()
{
   _results.id();
   toolbox.executeQuery("DELETE FROM plannedshiphead WHERE plannedshiphead_id=<? value('cnum')?>",{cnum : _results.id()});
}


mywindow.findChild("_query").clicked.connect(query);
_new.clicked.connect(newLine);
_delete.clicked.connect(del);