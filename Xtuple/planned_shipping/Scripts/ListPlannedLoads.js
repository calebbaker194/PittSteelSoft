debugger;
var _salesOrder=mywindow.findChild("_salesOrder");
var _cust=mywindow.findChild("_cust");
var _shipDate=mywindow.findChild("_shipdate");
var _driver=mywindow.findChild("_driver");
var _close=mywindow.findChild("_close");
var _edit=mywindow.findChild("_edit");
var _delete=mywindow.findChild("_delete");
var _new=mywindow.findChild("_new");
var _query=mywindow.findChild("_query");
var _loadNumber=mywindow.findChild("_loadNumber");
var _plannedloads=mywindow.findChild("_plannedLoads");
var _params=new Object();

_plannedloads.addColumn(qsTr("Load ID"),-1,1,false,"plannedshiphead_id")
_plannedloads.addColumn(qsTr("Load #"),-1,1,true,"loadNumber");
_plannedloads.addColumn(qsTr("Driver"),-1,1,true,"driver");
_plannedloads.addColumn(qsTr("Ship Date"),-1,1,true,"dateToShip");
_plannedloads.addColumn(qsTr("Load Weight"),-1,2,true,"weight");

function query()
{
   var LPLQry=toolbox.executeDbQuery("PlannedLoad","ListPlannedLoads",getFilters());
   _plannedloads.populate(LPLQry,true);
}

function edit()
{
   
   _params.plannedshiphead_id=_plannedloads.rawValue("plannedshiphead_id")
   _params.plannedshiphead_number=_plannedloads.rawValue("loadNumber")
   _params.edit=true;

   var childwnd = toolbox.openWindow("PlanLoad",mywindow,0,1);
   var tmp = toolbox.lastWindow().set(_params);
}

function deleteLoad()
{
   toolbox.executeQuery("DELETE FROM plannedshiphead WHERE plannedshiphead_id=<?value('plannedshiphead_id')?>",{plannedshiphead_number : _plannedloads.rawValue("plannedshiphead_id")});
}

function newLoad()
{
   var _idQry=toolbox.executeQuery("SELECT max(plannedshiphead_id)+1 AS id FROM plannedshiphead");
   if(_idQry.first())
   {
      _params.plannedshiphead_id=_idQry.value("id");
      _params.plannedshiphead_number=_params.plannedshiphead_id+100;
      _params.edit=false;
   }

   var childwnd = toolbox.openWindow("PlanLoad",mywindow,0,1);
   var tmp = toolbox.lastWindow().set(_params);
}

function getFilters()
{
   var _filters=new Object();
   
   if(_cust.id()!=-1)
   {
      _filters.cust_id=_cust.id();
   }
   if(_salesOrder.text!='')
   {
      _filters.cohead_number=_salesOrder.text
   }
   if(_shipDate.isValid())
    {
	_filters.date=_shipDate.toISOString();
    }
   if(_driver.code!='')
   {
      _filters.driver=_driver.code;
   }
   if(_loadNumber.text!='')
   {
      _filters.plannedshiphead_number=_loadNumber.text;
   }
   return _filters;
}
function populateDrivers()
{
   
}

populateDrivers();
_edit.clicked.connect(edit);
_delete.clicked.connect(deleteLoad);
_new.clicked.connect(newLoad)
_query.clicked.connect(query);
_close.clicked.connect(mywindow.close);