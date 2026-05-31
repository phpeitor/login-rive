<?php
// OAuth callback: exchange code for tokens and create session
session_start();

require_once __DIR__ . '/bootstrap.php';

$clientId = trim((string) app_env('GOOGLE_CLIENT_ID', ''));
$clientSecret = trim((string) app_env('GOOGLE_SECRET_KEY', ''));

if (empty($clientId) || empty($clientSecret)) {
    echo 'Missing client id or secret in server configuration.';
    exit;
}

if (empty($_GET['code'])) {
    echo 'Missing code';
    exit;
}

$code = $_GET['code'];

$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$base = $scheme . '://' . $_SERVER['HTTP_HOST'];
$scriptDir = rtrim(dirname($_SERVER['REQUEST_URI']), '/\\');
$redirectUri = $base . $scriptDir . '/oauth-callback.php';

$tokenUrl = 'https://oauth2.googleapis.com/token';
$post = http_build_query([
    'code' => $code,
    'client_id' => $clientId,
    'client_secret' => $clientSecret,
    'redirect_uri' => $redirectUri,
    'grant_type' => 'authorization_code',
]);

$ch = curl_init($tokenUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
$resp = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if ($resp === false) {
    echo 'Token exchange failed: ' . $err;
    exit;
}

$data = json_decode($resp, true);
if (!is_array($data) || empty($data['id_token'])) {
    echo 'Invalid token response: ' . htmlspecialchars($resp);
    exit;
}

// validate id_token via tokeninfo
$idToken = $data['id_token'];
$info = @file_get_contents('https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($idToken));
$payload = $info ? json_decode($info, true) : null;

if (!is_array($payload) || empty($payload['aud'])) {
    echo 'Invalid id_token after exchange.';
    exit;
}

// create session
$_SESSION['google_user'] = [
    'sub' => $payload['sub'] ?? null,
    'email' => $payload['email'] ?? null,
    'name' => $payload['name'] ?? null,
    'picture' => $payload['picture'] ?? null,
];

// Set a session expiration timestamp (seconds since epoch).
// Read optional SESSION_LIFETIME from .env (seconds), default to 3600 (1 hour).
$sessionLifetime = (int) app_env('SESSION_LIFETIME', 3600);
if ($sessionLifetime <= 0) {
    $sessionLifetime = 3600;
}
$_SESSION['google_expires_at'] = time() + $sessionLifetime;

// redirect back to app
header('Location: ' . str_replace('/php/oauth-callback.php', '/', $_SERVER['REQUEST_URI']));
exit;
