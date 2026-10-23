<?php
// fix_db.php - Utility to repair or reset the database if it gets stuck
require 'includes/db.php';

echo "<h1>Database Fix Utility</h1>";

if (isset($_GET['reset']) && $_GET['reset'] == '1') {
    $conn->query("DROP DATABASE IF EXISTS student_performance_db");
    echo "<p>Database dropped successfully. Refreshing the portal will recreate it.</p>";
    echo "<a href='index.php'>Go back to Portal</a>";
    exit;
}

echo "<p>Connected to database successfully.</p>";
echo "<a href='?reset=1' style='color:red'>WARNING: Click here to RESET the entire database (Deletes all data)</a><br><br>";
echo "<a href='index.php'>Go back to Portal</a>";
?>
