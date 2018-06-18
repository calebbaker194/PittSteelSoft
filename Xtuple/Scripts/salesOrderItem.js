//Add lot serial detail to the availibility tab
var _tabs=mywindow.findChild("_tabs");
var _ava=mywindow.findChild("_availability");
var _item=mywindow.findChild("_item")
var _layout=toolbox.widgetGetLayout(_ava);
_ava.visible=false;

var _availability=toolbox.createWidget("XTreeWidget",mywindow,"_availC");

_availability.addColumn(qsTr("Site"),-1,1,true,"site");
_availability.addColumn(qsTr("Lot/Serial #"),-1,1,true,"lotserial");
_availability.addColumn(qsTr("Qty."),-1,1,true,"quantity");
_availability.addColumn(qsTr("Item Description"),-1,1,true,"descrip");

_layout.addWidget(_availability);

function lotSerialTrack()
{
 if(_tabs.currentIndex==0)
 {
   mywindow.findChild("_showIndented").visible=false;
   
   debugger;
   var _qry=toolbox.executeQuery("SELECT warehous_code AS site,formatlotserialnumber(itemloc_ls_id) AS lotserial,itemloc_qty AS quantity,item_descrip1 AS descrip FROM itemsite LEFT JOIN item ON(itemsite_item_id=item_id),  whsinfo, itemloc LEFT OUTER JOIN location ON (itemloc_location_id=location_id) WHERE item_id=<? value('item_id')?> AND warehous_id=35 AND(itemloc_itemsite_id=itemsite_id) AND(itemsite_warehous_id=warehous_id) AND(itemsite_loccntrl OR (itemsite_controlmethod IN ('L', 'S')))",{"item_id":mywindow.findChild("_item").id()});
   
   _availability.populate(_qry);


 }
}
lotSerialTrack()
_item.newId.connect(lotSerialTrack) 