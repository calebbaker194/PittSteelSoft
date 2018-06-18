INSERT INTO uiform(
           uiform_name, uiform_order, uiform_enabled, uiform_source)
    VALUES ('recExportScreen', 5, TRUE, '<?xml version="1.0" encoding="UTF-8"?>
<ui version="4.0">
 <comment>This file is part of the xTuple ERP: PostBooks Edition, a free and
open source Enterprise Resource Planning software suite,
Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
It is licensed to you under the Common Public Attribution License
version 1.0, the full text of which (including xTuple-specific Exhibits)
is available at www.xtuple.com/CPAL.  By using this software, you agree
to be bound by its terms.</comment>
 <class>recExportScreen</class>
 <widget class="QWidget" name="recExportScreen">
  <property name="geometry">
   <rect>
    <x>0</x>
    <y>0</y>
    <width>274</width>
    <height>220</height>
   </rect>
  </property>
  <property name="windowTitle">
   <string>Export</string>
  </property>
  <layout class="QGridLayout" name="gridLayout">
   <item row="1" column="1">
    <layout class="QVBoxLayout" name="verticalLayout">
     <property name="leftMargin">
      <number>14</number>
     </property>
     <property name="rightMargin">
      <number>12</number>
     </property>
     <item>
      <spacer name="horizontalSpacer_2">
       <property name="orientation">
        <enum>Qt::Horizontal</enum>
       </property>
       <property name="sizeHint" stdset="0">
        <size>
         <width>40</width>
         <height>20</height>
        </size>
       </property>
      </spacer>
     </item>
    </layout>
   </item>
   <item row="0" column="1" colspan="2">
    <widget class="QTextBrowser" name="_results"/>
   </item>
   <item row="1" column="2">
    <layout class="QHBoxLayout" name="horizontalLayout">
     <item>
      <spacer name="horizontalSpacer">
       <property name="orientation">
        <enum>Qt::Horizontal</enum>
       </property>
       <property name="sizeHint" stdset="0">
        <size>
         <width>40</width>
         <height>20</height>
        </size>
       </property>
      </spacer>
     </item>
     <item>
      <widget class="QPushButton" name="_export">
       <property name="text">
        <string>Export</string>
       </property>
      </widget>
     </item>
    </layout>
   </item>
  </layout>
 </widget>
 <resources/>
 <connections/>
</ui>
');
