<?php
header('Content-Type: application/json; charset=utf-8');
session_start();
$user = $_SESSION['google_user'] ?? null;
if ($user) {
    $expires = isset($_SESSION['google_expires_at']) ? (int) $_SESSION['google_expires_at'] : null;
    echo json_encode(['ok' => true, 'user' => $user, 'expires_at' => $expires, 'now' => time()]);
} else {
    echo json_encode(['ok' => false]);
}
