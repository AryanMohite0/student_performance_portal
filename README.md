# Student Performance Portal

A simple and robust PHP/JS-based application to manage student performance, analyze slow/advanced learners, and map mentors.

## Structure
- `index.php` - The main application frontend entry point
- `css/style.css` - Application styling
- `js/script.js` - Application logic and interactions
- `php/api.php` - Backend REST API that bridges JS with MySQL
- `includes/db.php` - Database connection and schema initializer
- `database.sql` - Complete schema dump for MySQL
- `fix_db.php` - Helper script for database maintenance

## Setup
1. Copy this project to your `htdocs` folder in XAMPP.
2. Start Apache and MySQL in XAMPP.
3. Open `http://localhost/student_performance_portal_php` in your browser.
4. The database (`student_performance_db`) and tables will automatically be created on the first load via `includes/db.php`.

Enjoy!
