/**
 * Pasarela de pago SIMULADA. En un proyecto real aquí se llamaría al backend.
 * `resultadoSimulado` permite demostrar ambos flujos (aprobado / rechazado).
 */
export function procesarPago({ resultadoSimulado = "aprobado" } = {}) {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ aprobado: resultadoSimulado === "aprobado" }), 500)
  );
}
