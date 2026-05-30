<?php
header('Content-Type: application/json; charset=utf-8');
session_start();
// Eliminar la sesión del usuario (útil para pruebas locales)
unset($_SESSION['google_user']);
// Destruir la sesión completa
session_destroy();
echo json_encode(['ok' => true]);
