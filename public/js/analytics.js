// public/scripts/analytics.js

// Acessa a ID de Medição do Google Analytics da variável global injetada pelo servidor
// Um fallback ('G-FALLBACKID') é usado caso a variável não exista
const gaMeasurementId = window.GA_MEASUREMENT_ID || 'G-FALLBACKID';

// Garante que a ID seja válida e não seja o placeholder inicial 'G-NOT-CONFIGURED'
if (gaMeasurementId && gaMeasurementId !== 'G-NOT-CONFIGURED' && gaMeasurementId !== 'G-FALLBACKID') {
  // Google tag (gtag.js) - Carregamento dinâmico
  (function() {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
    document.head.appendChild(script);
  })();

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', gaMeasurementId);
} else {
  console.warn("GA_MEASUREMENT_ID não configurada ou inválida. Google Analytics desabilitado.");
}