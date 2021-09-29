<?php

// Do not use the value of $_SERVER['DOCUMENT_ROOT'] since it does not work for IIS.
$_SERVER['DOCUMENT_ROOT'] =
    substr($_SERVER['SCRIPT_FILENAME'], 0, -strlen($_SERVER['SCRIPT_NAME']));

define (DB_HOST,     'localhost');
define (DB_USER,     'user');
define (DB_PASSWORD, 'pwd');
define (DB_NAME,     'db');

define (LOCAL_APP_DIR, $_SERVER['DOCUMENT_ROOT'] . '/');
define (MAX_SIZE, 400);
