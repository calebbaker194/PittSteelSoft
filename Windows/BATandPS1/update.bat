@ECHO off
for /f "delims=: tokens=2" %%G in (\\Server\Directory\updateInfo.txt) do SET NVN=%%G
echo %errorlevel%
IF [%errorlevel%]==[0] ( 
echo no inital error
) ELSE (
echo The update has failed
exit /b
)
IF [%NVN%]==[] ( 
echo nvn set
) ELSE (
echo The update has failed NVN not set
)
cd c:\Xtuple\XtupleLive
for /f "tokens=*" %%F IN ('dir /s /b *.cvn') DO SET OVNF=%%F
for /f "delims=: tokens=2" %%G in (%OVNF%) do SET OVN=%%G
IF NOT %NVN%==%OVN% (
for /f "delims== tokens=1,2" %%G in (\\Server\Directory\updateInfo.txt) do SET Software=%%H
SET Name=%Software:~23%
robocopy %Software% C:\Xtuple\XtupleLive\xTupleNew /E
ren C:\Xtuple\XtupleLive\xTuple xTuple-%OVN%
robocopy C:\Xtuple\XtupleLive\xTuple-%OVN% C:\Xtuple\xTuple-%OVN% /E /MOVE 
rmdir C:\Xtuple\XtupleLive\xTuple-%OVN% /s /q
ren C:\Xtuple\XtupleLive\xTupleNew xTuple
del /f %OVNF%
FOR /F "tokens=*" %%G IN ('date /t') do SET installDate=%%G
@echo Current Version:%NVN%: Date=%installDate%>> C:\Xtuple\XtupleLive\%NVN%.cvn
) ELSE (
	@ECHO Nothing To Update
)

cd c:\Xtuple
dir /s /b /a:d > \\Server\Directory\%computername%.txt
