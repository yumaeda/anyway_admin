<?php

function formatBytes($bytes, $precision = 2) { 
    $units = array('B', 'KB', 'MB', 'GB', 'TB'); 

    $bytes = max($bytes, 0); 
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024)); 
    $pow = min($pow, count($units) - 1); 

    $bytes /= (1 << (10 * $pow)); 

    return round($bytes, $precision) . ' ' . $units[$pow]; 
} 

function printAvailableMemory($message) {
    $usedMemory = formatBytes(memory_get_usage());
    $maxMemory = ini_get('memory_limit') . 'B';
    echo("[$usedMemory / $maxMemory] $message<br />");
}
