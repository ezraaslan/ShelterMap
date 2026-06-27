import json
import sqlite3

DATABASE = "shelters.db"

conn = sqlite3.connect(DATABASE)
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS shelters(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    latitude REAL,
    longitude REAL,
    address TEXT,
    phone TEXT,
    website TEXT,
    operator TEXT,
    facility_type TEXT,
    serves TEXT,
    wheelchair TEXT,
    hours TEXT,
    notes TEXT
)
""")

with open("export.geojson", "r", encoding="utf-8") as f:
    data = json.load(f)

for feature in data["features"]:

    p = feature["properties"]

    if feature["geometry"]["type"] == "Point":
        lon, lat = feature["geometry"]["coordinates"]
    else:
        lon = feature["properties"]["@lon"]
        lat = feature["properties"]["@lat"]

    address = " ".join(filter(None, [
        p.get("addr:housenumber"),
        p.get("addr:street"),
        p.get("addr:city"),
        p.get("addr:postcode")
    ]))

    cur.execute("""
    INSERT INTO shelters
    (
        name,
        latitude,
        longitude,
        address,
        phone,
        website,
        operator,
        facility_type,
        serves,
        wheelchair,
        hours,
        notes
    )
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?)
    """, (
        p.get("name"),
        lat,
        lon,
        address,
        p.get("phone") or p.get("contact:phone"),
        p.get("website") or p.get("contact:website"),
        p.get("operator"),
        p.get("social_facility"),
        p.get("social_facility:for"),
        p.get("wheelchair"),
        p.get("opening_hours"),
        p.get("description")
    ))

conn.commit()
conn.close()

print("Database created successfully.")