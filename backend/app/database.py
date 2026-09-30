import pymysql
from pymysql.cursors import DictCursor
from . import config

def get_connection():
    return pymysql.connect(
        host=config.DB_HOST,
        port=config.DB_PORT,
        user=config.DB_USER,
        password=config.DB_PASSWORD,
        database=config.DB_NAME,
        charset="utf8mb4",
        cursorclass=DictCursor,
        autocommit=True
    )

def init_db():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(64) PRIMARY KEY,
                name VARCHAR(120) NOT NULL,
                email VARCHAR(160) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                platform VARCHAR(50) DEFAULT 'LeetCode',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """)
            cur.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id VARCHAR(64) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                source_type VARCHAR(50) DEFAULT 'upload',
                repo_url VARCHAR(500),
                detected_stack VARCHAR(100),
                total_files INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """)
            cur.execute("""
            CREATE TABLE IF NOT EXISTS scans (
                id VARCHAR(64) PRIMARY KEY,
                project_id VARCHAR(64),
                total_issues INT DEFAULT 0,
                critical_count INT DEFAULT 0,
                high_count INT DEFAULT 0,
                medium_count INT DEFAULT 0,
                low_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            );
            """)
            cur.execute("""
            CREATE TABLE IF NOT EXISTS issues (
                id VARCHAR(64) PRIMARY KEY,
                scan_id VARCHAR(64),
                type VARCHAR(50) NOT NULL,
                severity VARCHAR(20) NOT NULL,
                file_path VARCHAR(500) NOT NULL,
                line_number INT DEFAULT 1,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                code_snippet TEXT,
                recommendation TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE
            );
            """)
            cur.execute("""
            CREATE TABLE IF NOT EXISTS codedoctor_fixes (
                id VARCHAR(64) PRIMARY KEY,
                issue_id VARCHAR(64),
                original_code TEXT,
                improved_code TEXT,
                explanation TEXT,
                validation_status VARCHAR(50) DEFAULT 'VALIDATED',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
            );
            """)
        print("[DATABASE] MySQL connection and tables verified.")
    finally:
        conn.close()

def query_all(sql, params=None):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params or ())
            return cur.fetchall()
    finally:
        conn.close()

def query_one(sql, params=None):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params or ())
            return cur.fetchone()
    finally:
        conn.close()

def execute(sql, params=None):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params or ())
            return cur.lastrowid
    finally:
        conn.close()
