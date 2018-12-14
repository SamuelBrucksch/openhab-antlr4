[![Build Status](https://travis-ci.com/SamuelBrucksch/openhab-antlr4.svg?branch=master)](https://travis-ci.com/SamuelBrucksch/openhab-antlr4)

Steps to run this:
1. npm install
2. npm run downloadAntlr
3. npm run buildGrammar
4. npm run test

downloadAntlr will download the antlr binary, Java is required so buildGrammar will only work if Java is in PATH.

buildGrammar then creates the JS parser and lexer files that are needed to parse documents.

The tests contain some samples to validate text input for .items file from openhab.

TODO:
 - comments do not seem to work
 - better validation at binding params (e.g. this is currently possible but should not be valid:  {channel="homematic:..."})

 Samples of currently working items:
```String Livingroom_Light_Connection "Livingroom Ceiling Light [MAP(error.map):%s]" <myerror>
Switch Livingroom_Light "Livingroom Ceiling Light" <myswitch>
Contact Livingroom_Window "Ventana del salón [MAP(window_esp.map):%s]"
Switch Livingroom_Light "Livingroom Ceiling Light" <switch>
Number Livingroom_Temperature "Temperature [%.1f °C]"
String Livingroom_TV_Channel "Now Playing [%s]"
DateTime Livingroom_TV_LastUpdate "Last Update [%1$ta %1$tR]"
Number Livingroom_Clock_Battery "Battery Charge [%d %%]"
Location My_Location "My Location [%2$s°N %3$s°E %1$sm]"
Number Livingroom_Temperature "Temperature [%.1f °C]"
String Bedroom_Sonos_CurrentTitle "Title [%s]" (gBedRoom) {channel="sonos:..."}
Number Bathroom_WaschingMachine_Power "Power [%.0f W]" <energy> (gPower) {channel="homematic:..."}
Number Livingroom_Temperature "Temperature [%.1f °C]" <temperature> (gTemperature,gLivingroom) ["TargetTemperature"] {knx="1/0/15+0/0/15"}

Group:Switch e "label" <icon> (otherGroup)
Group:Switch:AND(value1,value2) e "label" <icon> (otherGroup)
Group:Switch:OR(value1,value2) e "label" <icon> (otherGroup)
Group:Switch:NAND(value1,value2) e "label" <icon> (otherGroup)
Group:Switch:NOR(value1,value2) e "label" <icon> (otherGroup)
Group:Switch:AVG e "label" <icon> (otherGroup)
Group:Switch:MAX e "label" <icon> (otherGroup)
Group:Switch:MIN e "label" <icon> (otherGroup)
Group:Switch:SUM e "label" <icon> (otherGroup)
```

Newlines inbetween also work.
