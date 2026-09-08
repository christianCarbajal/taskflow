import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "taskflow.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL DEFAULT 'todo',
            owner TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    cur.execute("SELECT COUNT(*) FROM tasks")
    count = cur.fetchone()[0]
    if count == 0:
        seed = [
            ("Sistemare login", "Il bottone di login non risponde su mobile", "todo", "alice"),
            ("Scrivere test API", "Coprire gli endpoint /tasks con test base", "in_progress", "bruno"),
            ("Aggiornare dipendenze", "Bump delle librerie backend a ultima versione", "done", "carla"),
            ("Rivedere copy dashboard", "I testi della dashboard sono da rivedere col team marketing", "todo", "alice"),
        ]
        cur.executemany(
            "INSERT INTO tasks (title, description, status, owner) VALUES (?, ?, ?, ?)",
            seed,
        )
    conn.commit()
    conn.close()
