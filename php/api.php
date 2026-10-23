<?php
require '../includes/db.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

// Helper to fetch all rows from a table
function fetchTable($conn, $tableName) {
    $res = $conn->query("SELECT * FROM " . $tableName);
    $arr = [];
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            // Typecast id to int since the JS expects numbers for IDs
            if (isset($row['id'])) $row['id'] = (int)$row['id'];
            if (isset($row['student_id'])) $row['student_id'] = (int)$row['student_id'];
            if (isset($row['subject_id'])) $row['subject_id'] = (int)$row['subject_id'];
            if (isset($row['mentor_id'])) $row['mentor_id'] = (int)$row['mentor_id'];
            if (isset($row['mentee_id'])) $row['mentee_id'] = (int)$row['mentee_id'];
            if (isset($row['cae1'])) $row['cae1'] = (int)$row['cae1'];
            if (isset($row['cae2'])) $row['cae2'] = (int)$row['cae2'];
            if (isset($row['is_read'])) $row['is_read'] = (int)$row['is_read'];
            $arr[] = $row;
        }
    }
    return $arr;
}

if ($action === 'get_all') {
    $data = [];
    
    // 1. Fetch KV Store data
    $result = $conn->query("SELECT * FROM kv_store");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $data[$row['key']] = json_decode($row['value'], true);
        }
    }
    
    // 2. Fetch Relational Tables
    // Note: We use the exact keys the frontend uses ('sp_students', etc.)
    $tables = [
        'admins' => 'sp_admins',
        'subjects' => 'sp_subjects',
        'students' => 'sp_students',
        'student_marks' => 'sp_student_marks',
        'notifications' => 'sp_notifications',
        'assignments' => 'sp_assignments',
        'mentor_mapping' => 'sp_mentor_mapping',
        'certificates' => 'sp_certificates'
    ];
    
    foreach ($tables as $table => $key) {
        $rows = fetchTable($conn, $table);
        if (!empty($rows) || isset($data['sp_initialized'])) {
            $data[$key] = $rows;
        }
    }

    echo json_encode($data);
    exit;
}

if ($action === 'set') {
    $key = $_GET['key'] ?? '';
    if (!$key) {
        http_response_code(400);
        exit;
    }
    
    $value = file_get_contents('php://input');
    $arr = json_decode($value, true);
    
    $tables = [
        'sp_admins' => 'admins',
        'sp_subjects' => 'subjects',
        'sp_students' => 'students',
        'sp_student_marks' => 'student_marks',
        'sp_notifications' => 'notifications',
        'sp_assignments' => 'assignments',
        'sp_mentor_mapping' => 'mentor_mapping',
        'sp_certificates' => 'certificates'
    ];
    
    if (isset($tables[$key]) && is_array($arr)) {
        $tableName = $tables[$key];
        
        // Since the JS always saves the FULL array of the entire collection,
        // the easiest and safest way to sync without complex delta logic
        // is to clear the table and re-insert the array.
        $conn->query("TRUNCATE TABLE " . $tableName);
        
        foreach ($arr as $row) {
            $cols = array_keys($row);
            $vals = array_values($row);
            
            // Build prepared statement dynamically
            $colNames = implode(", ", $cols);
            $placeholders = implode(", ", array_fill(0, count($cols), "?"));
            
            $types = "";
            foreach ($vals as $val) {
                if (is_int($val)) $types .= "i";
                elseif (is_float($val)) $types .= "d";
                else $types .= "s";
            }
            
            $stmt = $conn->prepare("INSERT INTO $tableName ($colNames) VALUES ($placeholders)");
            if ($stmt) {
                $stmt->bind_param($types, ...$vals);
                $stmt->execute();
            }
        }
    } else {
        // Fallback for primitive/misc data like session, initialized, next_ids
        $stmt = $conn->prepare("INSERT INTO kv_store (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)");
        $stmt->bind_param("ss", $key, $value);
        $stmt->execute();
    }
    
    echo json_encode(['success' => true]);
    exit;
}
?>
