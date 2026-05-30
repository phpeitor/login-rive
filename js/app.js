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
  var currentRiveSrc = '';
  var baseRiveSrc = './resources/marty_purple_loop.riv';
  var successRiveSrc = './resources/animate-success.riv';
  var successRiveAnimations = ['Pull Start', 'Pull Over', 'Pull End'];
  var lastNotifyAt = 0;
  var lastNotifyKey = '';

  var emailInput = document.getElementById('email');
  var passwordInput = document.getElementById('password');

  function markFieldInvalid(field, isInvalid) {
    if (!field) {
      return;
    }
    field.classList.toggle('is-invalid', !!isInvalid);
  }

  function validateRequiredFields() {
    var email = (emailInput && emailInput.value || '').trim();
    var password = (passwordInput && passwordInput.value || '').trim();
    var emailMissing = !email;
    var passwordMissing = !password;

    markFieldInvalid(emailInput, emailMissing);
    markFieldInvalid(passwordInput, passwordMissing);

    return !(emailMissing || passwordMissing);
  }

  function notify(type, message) {
    if (window.alertify) {
      var now = Date.now();
      var key = type + '::' + message;
      if (key === lastNotifyKey && now - lastNotifyAt < 1000) {
        return;
      }
      lastNotifyKey = key;
      lastNotifyAt = now;

      window.alertify.set('notifier', 'position', 'top-right');
      window.alertify.set('notifier', 'delay', 2.2);
      if (typeof window.alertify.dismissAll === 'function') {
        window.alertify.dismissAll();
      }
      window.alertify.notify(message, type, 2.2);
      return;
    }
    if (type === 'success') {
      console.log(message);
    } else {
      console.warn(message);
    }
  }

  function clearTransientState() {
    var container = document.querySelector('.container');
    if (container) {
      container.classList.remove('is-error', 'is-success');
    }
  }

  function disposeRiveInstance() {
    if (!riveInstance) {
      return;
    }

    try {
      if (typeof riveInstance.cleanup === 'function') {
        riveInstance.cleanup();
      } else if (typeof riveInstance.destroy === 'function') {
        riveInstance.destroy();
      } else if (typeof riveInstance.stop === 'function') {
        riveInstance.stop();
      }
    } catch (e) {
      console.warn('No se pudo limpiar la instancia anterior de Rive', e);
    }

    riveInstance = null;
  }

  function createRiveInstance(src, options) {
    var config = options || {};

    disposeRiveInstance();

    riveInstance = new riveNamespace.Rive({
      src: src,
      canvas: canvas,
      autoplay: config.autoplay !== false,
      animations: config.animations,
      stateMachines: config.stateMachines,
      layout: new riveNamespace.Layout({
        fit: riveNamespace.Fit.Contain,
        alignment: riveNamespace.Alignment.Center,
      }),
      onLoad: function() {
        resizeRiveSurface();
      },
    });

    currentRiveSrc = src;
    window._riveInstance = riveInstance;
  }

  function loadBaseCharacter() {
    createRiveInstance(baseRiveSrc, {
      stateMachines: ['Loop'],
    });
  }

  function loadSuccessCharacter() {
    createRiveInstance(successRiveSrc, {
      autoplay: true,
      animations: successRiveAnimations,
    });
  }

  function setLoginResultAnimation(result) {
    var container = document.querySelector('.container');
    if (!container) {
      return;
    }

    window.clearTimeout(resetStateTimer);
    clearTransientState();

    if (result === 'error') {
      if (currentRiveSrc !== baseRiveSrc) {
        loadBaseCharacter();
      }
      container.classList.add('is-error');
      if (riveInstance && typeof riveInstance.play === 'function') {
        riveInstance.play(['Wobble']);
      }
      resetStateTimer = window.setTimeout(clearTransientState, 1800);
      return;
    }

    if (result === 'success') {
      container.classList.add('is-success');
      loadSuccessCharacter();
      resetStateTimer = window.setTimeout(function() {
        clearTransientState();
        loadBaseCharacter();
      }, 2200);
    }
  }

  window.setLoginResultAnimation = setLoginResultAnimation;

  // Crear el canvas y cargar la animación
  const canvas = document.getElementById('rive-canvas');

  function resizeRiveSurface() {
    if (riveInstance && typeof riveInstance.resizeDrawingSurfaceToCanvas === 'function') {
      riveInstance.resizeDrawingSurfaceToCanvas();
    }
  }

  try {
    loadBaseCharacter();
  } catch (err) {
    console.error('Error cargando Rive:', err);
  }

  window.addEventListener('resize', resizeRiveSurface);

  if (emailInput) {
    emailInput.addEventListener('input', function() {
      markFieldInvalid(emailInput, false);
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', function() {
      markFieldInvalid(passwordInput, false);
    });
  }

  // Form handlers mínimos (no hacen autenticación real)
  document.getElementById('btnLogin').addEventListener('click', function(){
    if (!validateRequiredFields()) {
      clearTransientState();
      return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const loginOk = email.indexOf('@') > 0 && password.length >= 4;

    setLoginResultAnimation(loginOk ? 'success' : 'error');

    if (loginOk) {
      notify('success', 'Login exitoso para ' + email + ' (demo local)');
    } else {
      notify('error', 'Login fallido: revisa correo y contraseña');
    }
  });

  document.getElementById('btnTestError').addEventListener('click', function(){
    setLoginResultAnimation('error');
    notify('error', 'Login fallido: revisa correo y contraseña');
  });

  document.getElementById('btnTestSuccess').addEventListener('click', function(){
    setLoginResultAnimation('success');
  });
})();
