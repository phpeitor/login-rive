<?php
// Start OAuth 2.0 Authorization Code flow with Google (server-side)
// Redirects the user to Google's consent screen.

require_once __DIR__ . '/bootstrap.php';

$clientId = trim((string) app_env('GOOGLE_CLIENT_ID', ''));

if (!$clientId) {
    http_response_code(500);
    echo 'Missing GOOGLE_CLIENT_ID';
    exit;
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
// Debug: show the full auth URL when ?show=1 so user can copy redirect_uri exactly
if (!empty($_GET['show']) && $_GET['show'] === '1') {
    header('Content-Type: text/plain; charset=utf-8');
    echo $authUrl;
    exit;
}
header('Location: ' . $authUrl);
exit;
