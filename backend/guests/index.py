import json
import os
import psycopg2

SCHEMA = "t_p96100472_wedding_invitation_s"

def handler(event: dict, context) -> dict:
    """Сохранение и получение пожеланий гостей (напитки и аллергии)"""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    if event.get("httpMethod") == "POST":
        body = json.loads(event.get("body") or "{}")
        name = body.get("name", "").strip()
        drinks = body.get("drinks", [])
        allergies = body.get("allergies", "").strip()

        if not name:
            conn.close()
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Имя обязательно"})}

        cur.execute(
            f"INSERT INTO {SCHEMA}.guests (name, drinks, allergies) VALUES (%s, %s, %s) RETURNING id",
            (name, drinks, allergies or None)
        )
        guest_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True, "id": guest_id})}

    if event.get("httpMethod") == "GET":
        cur.execute(f"SELECT id, name, drinks, allergies, created_at FROM {SCHEMA}.guests ORDER BY created_at DESC")
        rows = cur.fetchall()
        conn.close()
        guests = [
            {"id": r[0], "name": r[1], "drinks": r[2] or [], "allergies": r[3], "created_at": str(r[4])}
            for r in rows
        ]
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"guests": guests})}

    conn.close()
    return {"statusCode": 405, "headers": headers, "body": json.dumps({"error": "Method not allowed"})}
