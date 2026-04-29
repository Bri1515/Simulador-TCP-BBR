function simularBBR() {
  const bandwidth = Number(document.getElementById("bandwidth").value);
  const rtt = Number(document.getElementById("rtt").value);
  const loss = Number(document.getElementById("loss").value);
  const tiempo = Number(document.getElementById("time").value);

  if (bandwidth <= 0 || rtt <= 0 || tiempo <= 0 || loss < 0 || loss > 100) {
    document.getElementById("resultado").innerHTML =
      "Ingrese valores válidos. La pérdida debe estar entre 0 y 100%.";
    return;
  }

  const bdp = bandwidth * (rtt / 1000);

  let cwnd = 1;
  let velocidad = 0;
  let resultado = "";

  resultado += `<p><strong>BDP estimado:</strong> ${bdp.toFixed(2)} Mb</p>`;
  resultado += `<p><strong>Pérdida de paquetes:</strong> ${loss}%</p>`;

  for (let t = 1; t <= tiempo; t++) {
    let fase = "";

    if (t <= tiempo * 0.3) {
      fase = "STARTUP";
      cwnd = cwnd * 2;
      velocidad = Math.min(bandwidth, velocidad + bandwidth * 0.25);
    } else if (t <= tiempo * 0.45) {
      fase = "DRAIN";
      cwnd = cwnd * 0.8;
      velocidad = bandwidth * 0.9;
    } else if (t <= tiempo * 0.85) {
      fase = "PROBE_BW";
      cwnd = bdp * 1.5;
      velocidad = bandwidth;
    } else {
      fase = "PROBE_RTT";
      cwnd = bdp * 0.8;
      velocidad = bandwidth * 0.7;
    }

    const velocidadFinal = velocidad * (1 - loss / 100);

    resultado += `
      <div class="linea">
        Tiempo: ${t}s |
        Fase: ${fase} |
        CWND: ${cwnd.toFixed(2)} |
        Velocidad: ${velocidadFinal.toFixed(2)} Mbps |
        Pérdida: ${loss}%
      </div>
    `;
  }

  document.getElementById("resultado").innerHTML = resultado;
}