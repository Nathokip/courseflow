-- ============================================================
--  Student Course Registration System
--  Database Schema  —  Version 1.0
-- ------------------------------------------------------------
--  Card        : 3 — Design Database & ERD
--  Assigned    : Bravin  (Database Designer / Student C)
--  Due         : Day 4
--  Est. Time   : 4 hrs
--  Priority    : High
--  Reviewed by : Obadiah (Kanban Manager / Business Analyst)
--  Generated   : schema_v1.sql
-- ============================================================

-- ── 0. DATABASE SETUP ─────────────────────────────────────────
CREATE DATABASE IF NOT EXISTS course_registration_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE course_registration_db;

-- ============================================================
-- TABLE 1: admins
-- Secondary actor — manages system via direct DB access.
-- Admin UI is OUT OF SCOPE for the current sprint.
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
    admin_id       INT            NOT NULL AUTO_INCREMENT,
    username       VARCHAR(50)    NOT NULL,
    password_hash  VARCHAR(255)   NOT NULL COMMENT 'bcrypt hash — never store plaintext',
    created_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ── Constraints ───────────────────────────────────────
    CONSTRAINT pk_admins        PRIMARY KEY (admin_id),
    CONSTRAINT uq_admin_username UNIQUE      (username)
) ENGINE=InnoDB COMMENT='System administrators (out-of-scope UI)';


-- ============================================================
-- TABLE 2: students
-- Primary actor — logs in and manages course enrolments.
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
    student_id     INT            NOT NULL AUTO_INCREMENT,
    student_number VARCHAR(20)    NOT NULL COMMENT 'e.g. STU2024001',
    first_name     VARCHAR(50)    NOT NULL,
    last_name      VARCHAR(50)    NOT NULL,
    email          VARCHAR(100)   NOT NULL,
    password_hash  VARCHAR(255)   NOT NULL COMMENT 'bcrypt hash — never store plaintext',
    created_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ── Constraints ───────────────────────────────────────
    CONSTRAINT pk_students           PRIMARY KEY (student_id),
    CONSTRAINT uq_student_number     UNIQUE      (student_number),
    CONSTRAINT uq_student_email      UNIQUE      (email),

    -- ── Indexes ───────────────────────────────────────────
    INDEX idx_student_email          (email),
    INDEX idx_student_number         (student_number)
) ENGINE=InnoDB COMMENT='Registered students — primary users of the system';


-- ============================================================
-- TABLE 3: courses
-- Course catalogue managed by Admin (via DB seed / SQL insert).
-- current_enrollment is maintained automatically by triggers.
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
    course_id          INT            NOT NULL AUTO_INCREMENT,
    course_code        VARCHAR(20)    NOT NULL COMMENT 'e.g. CS101',
    course_name        VARCHAR(100)   NOT NULL,
    instructor         VARCHAR(100)   NOT NULL,
    max_capacity       INT            NOT NULL DEFAULT 40
                           COMMENT 'Maximum seats available',
    current_enrollment INT            NOT NULL DEFAULT 0
                           COMMENT 'Auto-updated by triggers on registrations table',
    semester           VARCHAR(20)    NOT NULL COMMENT 'e.g. 2024/SEM1',
    created_at         TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ── Constraints ───────────────────────────────────────
    CONSTRAINT pk_courses       PRIMARY KEY (course_id),
    CONSTRAINT uq_course_code   UNIQUE      (course_code),
    CONSTRAINT chk_capacity     CHECK       (max_capacity > 0),
    CONSTRAINT chk_enrollment   CHECK       (current_enrollment >= 0),

    -- ── Indexes ───────────────────────────────────────────
    INDEX idx_course_code       (course_code),
    INDEX idx_semester          (semester)
) ENGINE=InnoDB COMMENT='Available courses in the registration system';


-- ============================================================
-- TABLE 4: registrations  (JUNCTION / BRIDGE TABLE)
-- Links students ←→ courses in a many-to-many relationship.
-- One student can enrol in many courses.
-- One course can have many students enrolled.
-- ============================================================
CREATE TABLE IF NOT EXISTS registrations (
    registration_id INT       NOT NULL AUTO_INCREMENT,
    student_id      INT       NOT NULL,
    course_id       INT       NOT NULL,
    registered_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status          ENUM('ACTIVE', 'DROPPED') NOT NULL DEFAULT 'ACTIVE'
                        COMMENT 'ACTIVE = currently enrolled; DROPPED = student withdrew',

    -- ── Constraints ───────────────────────────────────────
    CONSTRAINT pk_registrations         PRIMARY KEY (registration_id),

    -- Prevent the same student from registering for the same course twice (FR3 constraint)
    CONSTRAINT uq_student_course        UNIQUE      (student_id, course_id),

    -- ── Foreign Keys ──────────────────────────────────────
    CONSTRAINT fk_reg_student
        FOREIGN KEY (student_id)
        REFERENCES  students (student_id)
        ON DELETE   CASCADE      -- If a student is deleted, remove their registrations
        ON UPDATE   CASCADE,

    CONSTRAINT fk_reg_course
        FOREIGN KEY (course_id)
        REFERENCES  courses (course_id)
        ON DELETE   RESTRICT     -- Cannot delete a course that has active registrations
        ON UPDATE   CASCADE,

    -- ── Indexes ───────────────────────────────────────────
    INDEX idx_reg_student     (student_id),
    INDEX idx_reg_course      (course_id),
    INDEX idx_reg_status      (status)
) ENGINE=InnoDB COMMENT='Enrolment records linking students to courses';


-- ============================================================
-- TRIGGERS — Auto-update current_enrollment on courses
-- Satisfies FR3 & FR5: enrollment count must reflect reality
-- ============================================================

DELIMITER $$

-- After a new ACTIVE registration → increment count
CREATE TRIGGER trg_after_register_insert
AFTER INSERT ON registrations
FOR EACH ROW
BEGIN
    IF NEW.status = 'ACTIVE' THEN
        UPDATE courses
        SET    current_enrollment = current_enrollment + 1
        WHERE  course_id = NEW.course_id;
    END IF;
END$$

-- After status changes (e.g. ACTIVE → DROPPED) → decrement count
CREATE TRIGGER trg_after_register_update
AFTER UPDATE ON registrations
FOR EACH ROW
BEGIN
    IF OLD.status = 'ACTIVE' AND NEW.status = 'DROPPED' THEN
        UPDATE courses
        SET    current_enrollment = GREATEST(current_enrollment - 1, 0)
        WHERE  course_id = NEW.course_id;
    END IF;

    IF OLD.status = 'DROPPED' AND NEW.status = 'ACTIVE' THEN
        UPDATE courses
        SET    current_enrollment = current_enrollment + 1
        WHERE  course_id = NEW.course_id;
    END IF;
END$$

-- After a registration row is deleted → decrement count
CREATE TRIGGER trg_after_register_delete
AFTER DELETE ON registrations
FOR EACH ROW
BEGIN
    IF OLD.status = 'ACTIVE' THEN
        UPDATE courses
        SET    current_enrollment = GREATEST(current_enrollment - 1, 0)
        WHERE  course_id = OLD.course_id;
    END IF;
END$$

DELIMITER ;


-- ============================================================
-- SEED DATA — Sample records for development & testing
-- ============================================================

-- Admin account (password: admin123 — change before production)
INSERT INTO admins (username, password_hash) VALUES
    ('sysadmin', '$2b$12$ExampleHashForAdminAccountXXXXXXXXXXXXXXXXXXXXXXXXXX');

-- Sample students (passwords: password123 — for testing only)
INSERT INTO students (student_number, first_name, last_name, email, password_hash) VALUES
    ('STU2024001', 'Alice',   'Wanjiku',  'alice.wanjiku@university.ac.ke',  '$2b$12$HashAliceXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'),
    ('STU2024002', 'Brian',   'Otieno',   'brian.otieno@university.ac.ke',   '$2b$12$HashBrianXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'),
    ('STU2024003', 'Carol',   'Muthoni',  'carol.muthoni@university.ac.ke',  '$2b$12$HashCarolXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'),
    ('STU2024004', 'David',   'Kamau',    'david.kamau@university.ac.ke',    '$2b$12$HashDavidXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

-- Sample courses for semester 2024/SEM1
INSERT INTO courses (course_code, course_name, instructor, max_capacity, semester) VALUES
    ('CS101',  'Introduction to Computer Science',   'Dr. Njoroge',    40, '2024/SEM1'),
    ('CS201',  'Data Structures & Algorithms',       'Prof. Achieng',  35, '2024/SEM1'),
    ('CS301',  'Database Systems',                   'Dr. Mutua',      30, '2024/SEM1'),
    ('CS401',  'Software Engineering',               'Dr. Odhiambo',   25, '2024/SEM1'),
    ('MATH101','Discrete Mathematics',               'Prof. Kariuki',  50, '2024/SEM1'),
    ('NET201', 'Computer Networks',                  'Dr. Waweru',     30, '2024/SEM1');

-- Sample registrations (Alice registers for 3 courses)
INSERT INTO registrations (student_id, course_id, status) VALUES
    (1, 1, 'ACTIVE'),   -- Alice → CS101
    (1, 3, 'ACTIVE'),   -- Alice → CS301
    (1, 5, 'ACTIVE'),   -- Alice → MATH101
    (2, 1, 'ACTIVE'),   -- Brian → CS101
    (2, 2, 'ACTIVE'),   -- Brian → CS201
    (3, 4, 'ACTIVE'),   -- Carol → CS401
    (3, 6, 'ACTIVE'),   -- Carol → NET201
    (4, 2, 'DROPPED');  -- David dropped CS201 (status test)


-- ============================================================
-- VERIFICATION QUERIES — Run these to confirm setup is correct
-- ============================================================

-- Q1: List all courses with their current vs max capacity
SELECT  course_code,
        course_name,
        current_enrollment,
        max_capacity,
        CONCAT(current_enrollment, ' / ', max_capacity) AS seats_filled
FROM    courses
ORDER BY course_code;

-- Q2: Show all ACTIVE registrations with student and course details
SELECT  s.student_number,
        CONCAT(s.first_name, ' ', s.last_name) AS student_name,
        c.course_code,
        c.course_name,
        r.registered_at,
        r.status
FROM    registrations r
JOIN    students s ON s.student_id = r.student_id
JOIN    courses  c ON c.course_id  = r.course_id
WHERE   r.status = 'ACTIVE'
ORDER BY s.student_number, c.course_code;

-- Q3: Check capacity constraint — courses that are full
SELECT  course_code, course_name, current_enrollment, max_capacity
FROM    courses
WHERE   current_enrollment >= max_capacity;

-- ============================================================
-- END OF SCHEMA — schema_v1.sql
-- ============================================================
