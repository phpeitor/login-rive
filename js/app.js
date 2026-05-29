// app.js - ejemplo que carga un archivo .riv local y usa rive.wasm local
(function(){
  // Asegúrate de tener estos archivos en la misma carpeta:
  // - rive.wasm
  // - marty_purple_loop.riv  (o la animación que descargaste)

  const riveNamespace = window.rive || window.Rive;

  if (!riveNamespace || typeof riveNamespace.Rive !== 'function') {
    console.warn('Rive runtime no cargado. Verifica que `rive.js` está en la misma carpeta.');
    return;
  }

  // Si el loader expone RuntimeLoader, indicamos la URL local del WASM
  try {
    if (riveNamespace.RuntimeLoader && typeof riveNamespace.RuntimeLoader.setWasmUrl === 'function') {
      riveNamespace.RuntimeLoader.setWasmUrl('./resources/rive.wasm');
      if (typeof riveNamespace.RuntimeLoader.setWasmFallbackUrl === 'function') {
        riveNamespace.RuntimeLoader.setWasmFallbackUrl(null);
      }
    }
  } catch (e) {
    console.warn('No se pudo configurar RuntimeLoader.setWasmUrl()', e);
  }

  var riveInstance = null;
  var resetStateTimer = null;

  function clearTransientState() {
    var container = document.querySelector('.container');
    if (container) {
      container.classList.remove('is-error', 'is-success');
    }
  }

  function setLoginResultAnimation(result) {
    var container = document.querySelector('.container');
    if (!container) {
      return;
    }

    window.clearTimeout(resetStateTimer);
    clearTransientState();

    if (result === 'error') {
      container.classList.add('is-error');
      if (riveInstance && typeof riveInstance.play === 'function') {
        riveInstance.play(['Wobble']);
      }
      resetStateTimer = window.setTimeout(clearTransientState, 1800);
      return;
    }

    if (result === 'success') {
      container.classList.add('is-success');
      if (riveInstance && typeof riveInstance.play === 'function') {
        riveInstance.play(['Idle']);
      }
      resetStateTimer = window.setTimeout(clearTransientState, 1200);
    }
  }

  window.setLoginResultAnimation = setLoginResultAnimation;

  // Crear el canvas y cargar la animación
  const canvas = document.getElementById('rive-canvas');
  try {
    riveInstance = new riveNamespace.Rive({
      src: './resources/marty_purple_loop.riv',
      canvas: canvas,
      autoplay: true,
      stateMachines: ['Loop'],
      layout: new riveNamespace.Layout({
        fit: riveNamespace.Fit.Cover,
        alignment: riveNamespace.Alignment.Center,
      }),
    });
    // Guardar por si se necesita controlar desde consola
    window._riveInstance = riveInstance;
  } catch (err) {
    console.error('Error cargando Rive:', err);
  }

  // Form handlers mínimos (no hacen autenticación real)
  document.getElementById('btnLogin').addEventListener('click', function(){
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginOk = email.indexOf('@') > 0 && password.length >= 4;

    setLoginResultAnimation(loginOk ? 'success' : 'error');

    alert((loginOk ? 'Login exitoso: ' : 'Login fallido: ') + email + '\n(Este es un demo local, no hace login real)');
  });

  document.getElementById('btnTestError').addEventListener('click', function(){
    setLoginResultAnimation('error');
  });

  document.getElementById('btnTestSuccess').addEventListener('click', function(){
    setLoginResultAnimation('success');
  });
})();
