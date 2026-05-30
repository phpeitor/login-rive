<?php
header('Content-Type: text/html; charset=utf-8');

$envPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env';
$clientId = getenv('GOOGLE_CLIENT_ID') ?: '';
if (!$clientId && file_exists($envPath)) {
    $parsed = parse_ini_file($envPath, false, INI_SCANNER_RAW);
    if (is_array($parsed) && !empty($parsed['GOOGLE_CLIENT_ID'])) {
        $clientId = trim((string) $parsed['GOOGLE_CLIENT_ID']);
    }
}

$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$base = $scheme . '://' . $_SERVER['HTTP_HOST'];
$scriptDir = rtrim(dirname($_SERVER['REQUEST_URI']), '/\\');
$redirectUri = $base . $scriptDir . '/oauth-callback.php';

$params = [
    'client_id' => $clientId,
    'redirect_uri' => $redirectUri,
    'response_type' => 'code',
    'scope' => 'openid email profile',
    'access_type' => 'offline',
    'prompt' => 'select_account',
];

$authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);

?>
<!doctype html>
<meta charset="utf-8">
<title>Debug OAuth</title>
<style>body{font-family:system-ui,Segoe UI,Arial;padding:18px;color:#111}code{background:#f4f4f4;padding:4px 6px;border-radius:4px;display:block;margin:8px 0}</style>
<h2>Debug OAuth</h2>
<p><strong>Client ID:</strong></p>
<code><?php echo htmlspecialchars($clientId); ?></code>
<p><strong>Redirect URI (debe estar en Google Console):</strong></p>
<code><?php echo htmlspecialchars($redirectUri); ?></code>
<p><strong>URL de autorización generada:</strong></p>
<code><?php echo htmlspecialchars($authUrl); ?></code>
<p>
  <a href="<?php echo htmlspecialchars($authUrl); ?>" target="_blank">Abrir flujo de autorización en nueva pestaña</a>
</p>
<hr>
<p>Pasos recomendados:</p>
<ol>
  <li>En Google Cloud Console, selecciona el mismo <em>OAuth Client ID</em> que aparece arriba.</li>
  <li>Añade exactamente la <strong>Redirect URI</strong> mostrada aquí en <em>Authorized redirect URIs</em>.</li>
  <li>Guarda, espera ~30–60s y prueba el enlace "Abrir flujo de autorización".</li>
</ol>
