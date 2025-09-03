export default function TextoTerminos() {
  return (
    <div className="space-y-4 text-sm text-gray-700">
      <p>
        Estos Términos y Condiciones regulan el uso de la plataforma
        <strong> Studio Connect</strong> para el registro, promoción y
        contratación de estudios de grabación y salas de ensayo. Al registrarse
        y utilizar nuestros servicios, el propietario del estudio o sala acepta
        cumplir con lo establecido a continuación.
      </p>

      <h4 className="font-semibold">1. Registro y veracidad de la información</h4>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          El propietario declara que la información proporcionada en el registro
          es verídica, completa y actualizada.
        </li>
        <li>
          Studio Connect se reserva el derecho de solicitar comprobantes
          (ejemplo: registro comercial) para validar la legitimidad del
          establecimiento.
        </li>
      </ul>

      <h4 className="font-semibold">2. Responsabilidades del propietario</h4>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Garantizar que las instalaciones cumplen con condiciones adecuadas de
          seguridad, higiene y funcionamiento.
        </li>
        <li>
          Mantener actualizada la información de tarifas, disponibilidad,
          equipamiento y servicios ofrecidos.
        </li>
        <li>
          Responder de manera oportuna a solicitudes o reservas generadas a
          través de la plataforma.
        </li>
      </ul>

      <h4 className="font-semibold">3. Tarifas y formas de pago</h4>
      <p>
        El propietario establece las tarifas por hora o por día, las cuales
        deberán ser claras y transparentes. Studio Connect podrá cobrar
        comisiones por el uso de la plataforma, lo cual será informado en el
        momento correspondiente.
      </p>

      <h4 className="font-semibold">4. Uso de la plataforma</h4>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Queda prohibido publicar información falsa, engañosa o que infrinja
          derechos de terceros.
        </li>
        <li>
          Studio Connect podrá suspender o eliminar registros que incumplan estos
          términos.
        </li>
      </ul>

      <h4 className="font-semibold">5. Limitación de responsabilidad</h4>
      <p>
        Studio Connect actúa únicamente como intermediario entre propietarios y
        usuarios. No se responsabiliza por incumplimientos, daños o conflictos
        derivados de la relación contractual entre ambas partes.
      </p>

      <h4 className="font-semibold">6. Aceptación</h4>
      <p>
        Al completar el registro y marcar la casilla de aceptación, el
        propietario confirma que ha leído, comprendido y aceptado estos Términos
        y Condiciones.
      </p>
    </div>
  );
}
