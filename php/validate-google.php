<?php
header('Content-Type: application/json; charset=utf-8');

// Simple backend validator for Google id_token (JWT)
// Usage: POST { id_token: '...' }

// Read client id from env or .env
$envPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env';
$clientId = getenv('GOOGLE_CLIENT_ID') ?: '';
if (!$clientId && file_exists($envPath)) {
    $parsed = parse_ini_file($envPath, false, INI_SCANNER_RAW);
    if (is_array($parsed) && !empty($parsed['GOOGLE_CLIENT_ID'])) {
        $clientId = trim((string) $parsed['GOOGLE_CLIENT_ID']);
    }
}

$input = null;
$raw = file_get_contents('php://input');
if ($raw) {
    $input = json_decode($raw, true);
}

if (!is_array($input)) {
    $input = $_POST;
}

$idToken = isset($input['id_token']) ? trim($input['id_token']) : '';
if (!$idToken) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'missing_id_token']);
    exit;
}

// Validate with Google's tokeninfo endpoint
$url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($idToken);

$resp = false;
// try file_get_contents first
if (ini_get('allow_url_fopen')) {
    $resp = @file_get_contents($url);
}

// fallback to cURL if available
if ($resp === false) {
    if (function_exists('curl_version')) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        $resp = curl_exec($ch);
        $curlErr = curl_error($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($resp === false) {
            http_response_code(502);
            echo json_encode(['ok' => false, 'error' => 'tokeninfo_unavailable', 'curl_error' => $curlErr, 'http_code' => $httpCode]);
            exit;
        }
    } else {
        http_response_code(502);
        echo json_encode(['ok' => false, 'error' => 'tokeninfo_unavailable', 'reason' => 'allow_url_fopen_disabled_and_no_curl']);
        exit;
    }
}

$payload = json_decode($resp, true);
if (!is_array($payload) || empty($payload['aud'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_token']);
    exit;
}

// Check audience
if ($clientId && $payload['aud'] !== $clientId && (!is_array($payload['aud']) || !in_array($clientId, $payload['aud']))) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'invalid_audience']);
    exit;
}

// Check expiry
if (isset($payload['exp']) && (int)$payload['exp'] < time()) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'token_expired']);
    exit;
}

// At this point token is valid. Create a session for the user (demo)
session_start();
$_SESSION['google_user'] = [
    'sub' => isset($payload['sub']) ? $payload['sub'] : null,
    'email' => isset($payload['email']) ? $payload['email'] : null,
    'name' => isset($payload['name']) ? $payload['name'] : null,
    'picture' => isset($payload['picture']) ? $payload['picture'] : null,
];

echo json_encode(['ok' => true, 'payload' => $payload]);
