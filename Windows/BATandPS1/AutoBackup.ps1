$TimeStamp=Get-Date -Format MM-dd-yyyy
$DatabaseName="DBName"
$BackupLocation="C:\Location\File"
$FilePathAndName=$BackupLocation+$DatabaseName+"_"+$TimeStamp+".backup"
C:\pgBackupTool\AutoDump.bat $FilePathAndName $DatabaseName