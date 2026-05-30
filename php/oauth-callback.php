<?php
// OAuth callback: exchange code for tokens and create session
session_start();

$envPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env';
$clientId = getenv('GOOGLE_CLIENT_ID') ?: '';
$clientSecret = getenv('GOOGLE_SECRET_KEY') ?: '';
if (file_exists($envPath)) {
    $parsed = parse_ini_file($envPath, false, INI_SCANNER_RAW);
    if (is_array($parsed)) {
        if (empty($clientId) && !empty($parsed['GOOGLE_CLIENT_ID'])) $clientId = trim((string)$parsed['GOOGLE_CLIENT_ID']);
        if (empty($clientSecret) && !empty($parsed['GOOGLE_SECRET_KEY'])) $clientSecret = trim((string)$parsed['GOOGLE_SECRET_KEY']);
    }
}

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
$envPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env';
$sessionLifetime = 3600;
if (file_exists($envPath)) {
    $parsed = parse_ini_file($envPath, false, INI_SCANNER_RAW);
    if (is_array($parsed) && !empty($parsed['SESSION_LIFETIME'])) {
        $sessionLifetime = (int) $parsed['SESSION_LIFETIME'];
        if ($sessionLifetime <= 0) $sessionLifetime = 3600;
    }
}
$_SESSION['google_expires_at'] = time() + $sessionLifetime;

// redirect back to app
header('Location: ' . str_replace('/php/oauth-callback.php', '/', $_SERVER['REQUEST_URI']));
exit;
