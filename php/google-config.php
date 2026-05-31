<?php
header('Content-Type: application/javascript; charset=utf-8');

require_once __DIR__ . '/bootstrap.php';

$clientId = trim((string) app_env('GOOGLE_CLIENT_ID', ''));

if (!$clientId) {
    $clientId = 'PON_AQUI_TU_GOOGLE_CLIENT_ID';
}

echo 'window.APP_CONFIG = window.APP_CONFIG || {};';
echo 'window.APP_CONFIG.GOOGLE_CLIENT_ID = ' . json_encode($clientId) . ';';