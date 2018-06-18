@echo off
REM -F c is the format custom
REM most of the rest should be obvious except the authentication
REM the --no-password option requires setup of PGPASS to allow this user authentication without embedded or prompted password

"C:\Program Files\PostgreSQL\9.4\bin\pg_dump.exe" --host localhost -i --port 5432 --username "postgres" --no-password --blobs --verbose -F c --file %1 %2