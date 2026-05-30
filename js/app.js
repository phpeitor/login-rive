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
  var successStateMachineName = 'Reload';
  var lastNotifyAt = 0;
  var lastNotifyKey = '';
  var googleSignInReady = false;
  var googleOneTapPrompted = false;
  var googleIdentityInitialized = false;

  var emailInput = document.getElementById('email');
  var passwordInput = document.getElementById('password');
  var googleButtonHost = document.getElementById('btnGoogleLocal');

  function base64UrlDecode(input) {
    var base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    try {
      return decodeURIComponent(Array.prototype.map.call(atob(base64), function(char) {
        return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch (e) {
      return atob(base64);
    }
  }

  function parseJwtPayload(token) {
    var parts = (token || '').split('.');
    if (parts.length < 2) {
      return null;
    }

    try {
      return JSON.parse(base64UrlDecode(parts[1]));
    } catch (e) {
      return null;
    }
  }

  function alertGoogleAccountName(credential) {
    var payload = parseJwtPayload(credential);
    var name = payload && (payload.name || payload.given_name || payload.email) ? (payload.name || payload.given_name || payload.email) : 'Cuenta Google';

    notify('success', 'Bienvenido ' + name + '');
    if (window.alertify && typeof window.alertify.alert === 'function') {
      window.alertify.alert('Ingreso con Google', 'Ingreso con Google: ' + name);
      return;
    }

    window.alert('Ingreso con Google: ' + name);
  }

  function handleGoogleCredentialResponse(response) {
    if (!response || !response.credential) {
      notify('error', 'No se recibió credencial de Google. Revisa tu sesión en Google o las cookies del navegador.');
      return;
    }

    // Envío seguro al backend para validación
    try {
      fetch('./php/validate-google.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: response.credential }),
      }).then(function(res) {
        return res.json().catch(function(){ return { ok: false, error: 'invalid_response' }; });
      }).then(function(data) {
        if (data && data.ok) {
          var name = (data.payload && (data.payload.name || data.payload.email)) ? (data.payload.name || data.payload.email) : 'Cuenta Google';
          notify('success', 'Bienvenido ' + name);
          if (window.alertify && typeof window.alertify.alert === 'function') {
            window.alertify.alert('Ingreso con Google', 'Ingreso con Google: ' + name);
          } else {
            alert('Ingreso con Google: ' + name);
          }
        } else {
          notify('error', 'Validación en servidor fallida: ' + (data && data.error ? data.error : 'unknown'));
        }
      }).catch(function(err) {
        console.error('Error validando token en servidor', err);
        notify('error', 'Error validando token en servidor');
      });
    } catch (e) {
      console.error(e);
      notify('error', 'Error enviando credencial al servidor');
    }
  }

  function initializeGoogleSignIn() {
    var clientId = window.APP_CONFIG && window.APP_CONFIG.GOOGLE_CLIENT_ID;

    if (!clientId || clientId === 'PON_AQUI_TU_GOOGLE_CLIENT_ID') {
      if (googleButtonHost) {
        googleButtonHost.title = 'Configura GOOGLE_CLIENT_ID en php/google-config.php';
      }
      console.warn('Falta configurar GOOGLE_CLIENT_ID en php/google-config.php');
      return;
    }

    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      window.setTimeout(initializeGoogleSignIn, 250);
      return;
    }

    if (!googleIdentityInitialized) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        ux_mode: 'popup',
      });

      googleIdentityInitialized = true;
      // Renderizar el botón nativo si el contenedor existe
      if (typeof renderNativeGoogleButton === 'function') {
        renderNativeGoogleButton();
      }
    }

    googleSignInReady = true;
  }

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
      stateMachines: [successStateMachineName],
    });

    window.setTimeout(function() {
      if (!riveInstance || typeof riveInstance.stateMachineInputs !== 'function') {
        return;
      }

      var inputs = riveInstance.stateMachineInputs(successStateMachineName) || [];
      if (!inputs.length) {
        return;
      }

      var pullAmountInput = inputs.find(function(input) {
        return input && input.name === 'pullAmount';
      });
      var pullReleaseInput = inputs.find(function(input) {
        return input && input.name === 'pullRelease';
      });
      var loadFinishedInput = inputs.find(function(input) {
        return input && input.name === 'loadFinished';
      });

      if (pullAmountInput && typeof pullAmountInput.value !== 'undefined') {
        pullAmountInput.value = 3.25;
      }

      if (loadFinishedInput) {
        if (typeof loadFinishedInput.fire === 'function') {
          loadFinishedInput.fire();
        } else if (typeof loadFinishedInput.value !== 'undefined') {
          loadFinishedInput.value = true;
        }
      }

      window.setTimeout(function() {
        if (pullReleaseInput) {
          if (typeof pullReleaseInput.fire === 'function') {
            pullReleaseInput.fire();
          } else if (typeof pullReleaseInput.value !== 'undefined') {
            pullReleaseInput.value = true;
          }
        }

        if (pullAmountInput && typeof pullAmountInput.value !== 'undefined') {
          pullAmountInput.value = 4;
        }
      }, 160);
    }, 120);
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

  if (googleButtonHost) {
    googleButtonHost.addEventListener('click', function() {
      // Iniciar flujo server-side (redirect a php/oauth-start.php)
      try {
        window.location.href = './php/oauth-start.php';
      } catch (e) {
        console.error('No se pudo iniciar el flujo server-side', e);
        notify('error', 'No se pudo iniciar el flujo con Google.');
      }
    });
  }

  // Renderizar el botón nativo de Google una vez inicializado
  function renderNativeGoogleButton() {
    try {
      var clientId = window.APP_CONFIG && window.APP_CONFIG.GOOGLE_CLIENT_ID;
      if (!clientId || clientId === 'PON_AQUI_TU_GOOGLE_CLIENT_ID') return;
      var host = document.getElementById('gSignInDiv');
      if (!host || !window.google || !window.google.accounts || !window.google.accounts.id) return;

      // Renderiza el botón nativo con ancho completo
      window.google.accounts.id.renderButton(host, {
        theme: 'outline',
        size: 'large',
        width: '100%'
      });
    } catch (e) {
      console.warn('No se pudo renderizar el botón nativo de Google', e);
    }
  }

  // Comprobar si el servidor ya creó una sesión (flujo server-side)
  var _sessionTimerId = null;
  function startSessionTimer(seconds) {
    var remaining = Math.max(0, parseInt(seconds, 10) || 60);
    var el = document.getElementById('sessionTimer');
    function formatTime(sec) {
      var m = Math.floor(sec / 60);
      var s = sec % 60;
      return (m > 0 ? m + ':' + (s < 10 ? '0' + s : s) : s + 's');
    }

    // Mostrar contador en UI
    if (el) {
      el.textContent = 'Sesión expira en ' + formatTime(remaining);
      el.classList.remove('hidden');
      el.classList.add('visible');
    }

    // Notificar inicio (opcional)
    notify('info', 'Sesión activa. Se cerrará en ' + remaining + 's (prueba)');

    // Limpiar any timer previo
    if (_sessionTimerId) {
      clearInterval(_sessionTimerId);
      _sessionTimerId = null;
    }

    _sessionTimerId = setInterval(function() {
      remaining--;
      if (el) el.textContent = 'Sesión expira en ' + formatTime(remaining);
      if (remaining === 30) notify('info', 'Sesión cerrará en 30s (prueba)');
      if (remaining === 10) notify('info', 'Sesión cerrará en 10s (prueba)');
      if (remaining <= 0) {
        clearInterval(_sessionTimerId);
        _sessionTimerId = null;
        if (el) { el.classList.remove('visible'); el.classList.add('hidden'); }
        // Llamar al endpoint que destruye la sesión en el servidor
        fetch('./php/logout.php', { method: 'POST', credentials: 'same-origin' })
          .then(function(res){ return res.json().catch(function(){ return { ok: false }; }); })
          .then(function(data){
            if (data && data.ok) {
              notify('success', 'Sesión destruida (prueba). Recargando...');
              window.setTimeout(function(){ window.location.reload(); }, 900);
            } else {
              notify('error', 'No se pudo destruir la sesión en el servidor');
            }
          }).catch(function(err){
            console.error('Error destruyendo sesión', err);
            notify('error', 'Error destruyendo la sesión');
          });
      }
    }, 1000);
  }

  function checkServerSession() {
    try {
      fetch('./php/session.php', { credentials: 'same-origin' })
        .then(function(res){ return res.json().catch(function(){ return { ok: false }; }); })
        .then(function(data){
          if (data && data.ok && data.user) {
            var name = data.user.name || data.user.email || 'Cuenta Google';
            notify('success', 'Bienvenido ' + name);
            try { setLoginResultAnimation('success'); } catch(e){}
            // iniciar temporizador de 60s para pruebas
            startSessionTimer(60);
          }
        }).catch(function(err){
          console.warn('No fue posible comprobar sesión en servidor', err);
        });
    } catch (e) {
      console.warn('Error iniciando comprobación de sesión', e);
    }
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

  initializeGoogleSignIn();
  // Comprobar sesión server-side (para flujo iniciado por el botón CSS)
  checkServerSession();
})();
