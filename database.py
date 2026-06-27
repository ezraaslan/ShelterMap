import sqlite3

def get_all_shelters():
    conn = sqlite3.connect("shelters.db")
    conn.row_factory = sqlite3.Row

    shelters = conn.execute(
        "SELECT * FROM shelters"
    ).fetchall()

    conn.close()

    return [dict(x) for x in shelters]