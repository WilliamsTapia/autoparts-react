@echo off
setlocal
pushd "%~dp0" || exit /b 1

if not defined ADMIN_USERNAME set "ADMIN_USERNAME=admin@duoc.cl"
if not defined ADMIN_PASSWORD set "ADMIN_PASSWORD=AutoPartsDemo2026"
if not defined JWT_SECRET (
    for /f "delims=" %%K in ('powershell.exe -NoProfile -Command "$bytes = New-Object byte[] 32; $rng = [Security.Cryptography.RandomNumberGenerator]::Create(); try { $rng.GetBytes($bytes); [Convert]::ToBase64String($bytes) } finally { $rng.Dispose() }"') do set "JWT_SECRET=%%K"
)
if not defined JWT_SECRET (
    echo No se pudo generar la clave JWT.
    popd
    exit /b 1
)

call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local %*
set "RESULTADO=%ERRORLEVEL%"
popd
exit /b %RESULTADO%
