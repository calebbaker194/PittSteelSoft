ECHO off
robocopy "%~dp0Xtuple" C:\Xtuple /E
net user IT itonly /add
net share Xtuple=C:\Xtuple /GRANT:IT,FULL
SchTasks /Create /SC DAILY /TN XtupleUpdate /TR C:\Xtuple\update.bat /ST 18:00
cd "%~dp0Xtuple"
cd ..
cd ..
rmdir  DirectorySetup /s /q
c:\Xtuple\update.bat