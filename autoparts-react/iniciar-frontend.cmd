@echo off
setlocal
pushd "%~dp0" || exit /b 1
title AutoParts CL - Frontend

rem Uso: doble clic, o  iniciar-frontend.cmd [puerto_del_backend]
rem Por defecto el backend se busca en el puerto 8080 y la tienda se abre en el 3000.
rem Si arrancaste el backend en otro puerto, por ejemplo 8082, ejecuta: iniciar-frontend.cmd 8082

where node >nul 2>&1
if errorlevel 1 (
    echo No se encontro Node.js. Instalalo desde https://nodejs.org y vuelve a intentarlo.
    goto :error
)

if not exist "package.json" (
    echo Deja este archivo dentro de la carpeta autoparts-react, junto a package.json.
    goto :error
)

if not defined PORT set "PORT=3000"

set "PUERTO_API=%~1"
if not defined PUERTO_API set "PUERTO_API=8080"
if not defined REACT_APP_API_URL set "REACT_APP_API_URL=http://localhost:%PUERTO_API%/api/v1"

if not exist "node_modules\react-scripts\bin\react-scripts.js" (
    echo Instalando dependencias, esto solo ocurre la primera vez...
    call npm.cmd ci
    if errorlevel 1 (
        echo Fallo la instalacion de dependencias. Revisa el error de arriba.
        goto :error
    )
)

echo.
echo Tienda: http://localhost:%PORT%
echo API:    %REACT_APP_API_URL%
echo Si la tienda no carga datos, inicia primero el backend con iniciar-local.cmd.
echo Para detener el frontend, presiona Ctrl+C o cierra esta ventana.
echo.

call npm.cmd start
if errorlevel 1 goto :error

popd
exit /b 0

:error
echo.
pause
popd
exit /b 1
