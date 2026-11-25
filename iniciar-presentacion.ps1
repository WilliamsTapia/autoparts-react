param(
    [ValidateRange(1024, 65535)][int]$Puerto = 8082,
    [ValidateRange(1024, 65535)][int]$PuertoFrontend = 3000
)

$ErrorActionPreference = 'Stop'

function Buscar-PuertoLibre([int]$Desde, [int]$Excluir = 0) {
    $hasta = [Math]::Min($Desde + 30, 65535)
    for ($candidato = $Desde; $candidato -le $hasta; $candidato++) {
        if ($candidato -eq $Excluir) { continue }
        $direccion = [System.Net.IPAddress]::Any
        if ([System.Net.Sockets.Socket]::OSSupportsIPv6) {
            $direccion = [System.Net.IPAddress]::IPv6Any
        }
        $socket = [System.Net.Sockets.TcpListener]::new($direccion, $candidato)
        try {
            if ($direccion.AddressFamily -eq 'InterNetworkV6') { $socket.Server.DualMode = $true }
            $socket.ExclusiveAddressUse = $true
            $socket.Start()
            return $candidato
        } catch [System.Net.Sockets.SocketException] {
            continue
        } finally {
            $socket.Stop()
        }
    }
    throw "No se encontro un puerto libre entre $Desde y $hasta."
}

$backend = Join-Path $PSScriptRoot 'autoparts-backend'
$frontend = Join-Path $PSScriptRoot 'autoparts-react'

if (!(Test-Path (Join-Path $backend 'iniciar-local.cmd')) -or
    !(Test-Path (Join-Path $frontend 'package-lock.json'))) {
    throw 'Deja este archivo junto a las carpetas autoparts-backend y autoparts-react.'
}

Push-Location $frontend
try {
    if (!(Test-Path 'node_modules/react-scripts/bin/react-scripts.js')) {
        & npm.cmd ci
        if ($LASTEXITCODE -ne 0) { throw 'Fallo npm ci. Revisa el error de instalacion.' }
    }

    $api = Buscar-PuertoLibre $Puerto
    $web = Buscar-PuertoLibre $PuertoFrontend $api
    $env:SERVER_PORT = "$api"
    $env:PORT = "$web"
    $env:AUTOPARTS_FRONTEND_ORIGIN = "http://localhost:$web"
    $env:REACT_APP_API_URL = "http://localhost:$api/api/v1"

    Write-Host "Backend: $env:REACT_APP_API_URL"
    Write-Host "Tienda:  $env:AUTOPARTS_FRONTEND_ORIGIN"
    $ventana = Start-Process -FilePath $env:ComSpec -ArgumentList '/k', 'iniciar-local.cmd' `
        -WorkingDirectory $backend -PassThru
    Write-Host 'Esperando al backend. Si falla, revisa su ventana.'

    $listo = $false
    $limite = (Get-Date).AddMinutes(3)
    while ((Get-Date) -lt $limite -and !$ventana.HasExited) {
        try {
            $respuesta = Invoke-WebRequest "$env:REACT_APP_API_URL/productos" -UseBasicParsing -TimeoutSec 2
            $listo = $respuesta.StatusCode -eq 200
            if ($listo) { break }
        } catch {
            Start-Sleep -Seconds 1
        }
    }
    if (!$listo) {
        throw 'El backend no respondio. Revisa su ventana antes de volver a ejecutar el lanzador.'
    }

    & npm.cmd start
    if ($LASTEXITCODE -ne 0) { throw 'React termino con un error. Revisa la salida de esta terminal.' }
} finally {
    Pop-Location
}
