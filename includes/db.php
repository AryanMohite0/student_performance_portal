<?php
$host = 'localhost';
$user = 'root';
$pass = ''; // Default XAMPP password is empty

// We need to create the DB if it doesn't exist
$conn = new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "MySQL Connection failed: " . $conn->connect_error]));
}

$conn->query("CREATE DATABASE IF NOT EXISTS student_performance_db");
$conn->select_db("student_performance_db");

// Core KV store for non-relational data (like initialized flag, session info, next_ids)
$conn->query("CREATE TABLE IF NOT EXISTS kv_store (
    `key` VARCHAR(100) PRIMARY KEY,
    `value` LONGTEXT NOT NULL
)");

// Relational tables for all the app data!
$conn->query("CREATE TABLE IF NOT EXISTS admins (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
)");

$conn->query("CREATE TABLE IF NOT EXISTS subjects (
    id INT PRIMARY KEY,
    name VARCHAR(255)
)");

$conn->query("CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY,
    roll_number VARCHAR(100),
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    overall_category VARCHAR(50)
)");

$conn->query("CREATE TABLE IF NOT EXISTS student_marks (
    id INT PRIMARY KEY,
    student_id INT,
    subject_id INT,
    cae1 INT,
    cae2 INT,
    category VARCHAR(50)
)");

$conn->query("CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY,
    student_id INT,
    type VARCHAR(50),
    message TEXT,
    is_read INT,
    created_at VARCHAR(100)
)");

$conn->query("CREATE TABLE IF NOT EXISTS assignments (
    id INT PRIMARY KEY,
    student_id INT,
    subject_id INT,
    assignment_link TEXT,
    deadline VARCHAR(100),
    status VARCHAR(50)
)");

$conn->query("CREATE TABLE IF NOT EXISTS mentor_mapping (
    id INT PRIMARY KEY,
    mentor_id INT,
    mentee_id INT
)");

$conn->query("CREATE TABLE IF NOT EXISTS certificates (
    id INT PRIMARY KEY,
    student_id INT,
    link TEXT,
    description TEXT,
    uploaded_at VARCHAR(100)
)");
?>
