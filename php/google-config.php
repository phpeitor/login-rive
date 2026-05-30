<?php
header('Content-Type: application/javascript; charset=utf-8');

$envPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env';
$clientId = getenv('GOOGLE_CLIENT_ID') ?: '';

if (!$clientId && file_exists($envPath)) {
    $parsed = parse_ini_file($envPath, false, INI_SCANNER_RAW);
    if (is_array($parsed) && !empty($parsed['GOOGLE_CLIENT_ID'])) {
        $clientId = trim((string) $parsed['GOOGLE_CLIENT_ID']);
    }
}

if (!$clientId) {
    $clientId = 'PON_AQUI_TU_GOOGLE_CLIENT_ID';
}

echo 'window.APP_CONFIG = window.APP_CONFIG || {};';
echo 'window.APP_CONFIG.GOOGLE_CLIENT_ID = ' . json_encode($clientId) . ';';