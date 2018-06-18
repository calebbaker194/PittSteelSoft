// Add the ability to print shipment labels directly from issue to shipping
var _receive=mywindow.findChild("_receive");
var _layout=toolbox.widgetGetLayout(_receive);
var _shipmentLabels=toolbox.createWidget("XCheckBox",mywindow,"_shipmentLabels");
_shipmentLabels.text="Print Shipping Labels";
_shipmentLabels.checked=false;
_layout.addWidget(_shipmentLabels,7,0);


function sPrintLabels()
{
 try
 {
   if(_shipmentLabels.checked)
   {
    var params=new Object;
    params.shiphead_id=_shipment.id();
    var wnd=toolbox.openWindow("shipmentLabels",mainwindow,Qt.ApplicationModal,Qt.Dialog);
    
    toolbox.lastWindow().set(params);
   }
 }
 catch(e)
 {
  QMessageBox.critical(mywindow,"shipOrder",qsTr("Label Printing Exception"+e));
 }
}

mywindow._ship.clicked.connect(sPrintLabels);