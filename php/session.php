<?php
header('Content-Type: application/json; charset=utf-8');
session_start();
$user = $_SESSION['google_user'] ?? null;
if ($user) {
    echo json_encode(['ok' => true, 'user' => $user]);
} else {
    echo json_encode(['ok' => false]);
}
