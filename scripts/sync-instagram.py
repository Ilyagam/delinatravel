#!/usr/bin/env python3
"""
Синхронизация Instagram постов @delina_travel → Supabase Storage + таблица instagram_posts.

КОНТРАКТ:
- Вход: аккаунт Instagram (для API доступа), целевой профиль @delina_travel
- Выход: последние 12 фото загружены в Supabase Storage, метаданные в instagram_posts
- Дедупликация по instagram_id — безопасно запускать повторно

Запуск: python3 scripts/sync-instagram.py
Зависимости: pip install instagrapi supabase Pillow
"""

import os
import sys
import json
import tempfile
import requests
from pathlib import Path
from datetime import datetime

# REASON: instagrapi — единственная рабочая библиотека для Instagram API без официального токена
from instagrapi import Client as InstaClient
from supabase import create_client

# --- Конфигурация ---

TARGET_PROFILE = "delina_travel"
MAX_POSTS = 12

# Instagram credentials (из существующего бота)
INSTA_CONFIG_PATH = os.path.expanduser("~/.claude/instagram-bot/config.json")
INSTA_SESSION_PATH = os.path.expanduser("~/.claude/instagram-bot/instagram_session.json")

# Supabase credentials
SUPABASE_URL = "https://tiiwufepkczyflpdzlvh.supabase.co"
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpaXd1ZmVwa2N6eWZscGR6bHZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAwMzY1MiwiZXhwIjoyMDg5NTc5NjUyfQ.eaItoMzWP81dqdagHeVmapNqUKbNkKdHBhiVdubr2rc"
)

STORAGE_BUCKET = "instagram-photos"


def login_instagram() -> InstaClient:
    """Логин в Instagram через существующую сессию или credentials."""
    cl = InstaClient()

    # Пробуем загрузить существующую сессию
    if os.path.exists(INSTA_SESSION_PATH):
        try:
            cl.load_settings(INSTA_SESSION_PATH)
            cl.login_by_sessionid(cl.settings.get("authorization_data", {}).get("sessionid", ""))
            print("✓ Загружена существующая сессия Instagram")
            return cl
        except Exception:
            print("⚠ Сессия устарела, логинимся заново...")

    # Логин по credentials
    with open(INSTA_CONFIG_PATH) as f:
        config = json.load(f)

    cl.login(config["username"], config["password"])
    cl.dump_settings(INSTA_SESSION_PATH)
    print(f"✓ Залогинились как @{config['username']}")
    return cl


def fetch_posts(cl: InstaClient) -> list:
    """Получить последние посты из профиля @delina_travel."""
    user_id = cl.user_id_from_username(TARGET_PROFILE)
    medias = cl.user_medias(user_id, amount=MAX_POSTS)

    posts = []
    for media in medias:
        # Берём первое фото (для каруселей — обложку)
        image_url = str(media.thumbnail_url or "")
        if not image_url and media.resources:
            image_url = str(media.resources[0].thumbnail_url or "")

        if not image_url:
            continue

        posts.append({
            "instagram_id": media.pk,
            "image_url": image_url,
            "caption": (media.caption_text or "")[:200],
            "permalink": f"https://www.instagram.com/p/{media.code}/",
            "posted_at": media.taken_at.isoformat() if media.taken_at else None,
        })

    print(f"✓ Получено {len(posts)} постов из @{TARGET_PROFILE}")
    return posts


def download_image(url: str, filename: str) -> str:
    """Скачать фото во временный файл."""
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()

    tmp_path = os.path.join(tempfile.gettempdir(), filename)
    with open(tmp_path, "wb") as f:
        f.write(resp.content)
    return tmp_path


def sync_to_supabase(posts: list):
    """Загрузить фото в Supabase Storage и сохранить метаданные."""
    sb = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    # Получить существующие instagram_id для дедупликации
    existing = sb.table("instagram_posts").select("instagram_id").execute()
    existing_ids = {str(row["instagram_id"]) for row in existing.data}

    new_count = 0
    for post in posts:
        post_id = str(post["instagram_id"])
        if post_id in existing_ids:
            print(f"  → Пропуск {post_id} (уже есть)")
            continue

        # Скачиваем фото
        filename = f"{post_id}.jpg"
        try:
            tmp_path = download_image(post["image_url"], filename)
        except Exception as e:
            print(f"  ✗ Ошибка скачивания {post_id}: {e}")
            continue

        # Загружаем в Supabase Storage
        storage_path = f"posts/{filename}"
        try:
            with open(tmp_path, "rb") as f:
                sb.storage.from_(STORAGE_BUCKET).upload(
                    storage_path,
                    f.read(),
                    file_options={"content-type": "image/jpeg", "upsert": "true"}
                )
        except Exception as e:
            print(f"  ✗ Ошибка загрузки в Storage {post_id}: {e}")
            continue
        finally:
            os.unlink(tmp_path)

        # Публичный URL из Supabase Storage
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{STORAGE_BUCKET}/{storage_path}"

        # Сохраняем в таблицу
        sb.table("instagram_posts").insert({
            "instagram_id": post_id,
            "image_url": public_url,
            "caption": post["caption"],
            "permalink": post["permalink"],
            "posted_at": post["posted_at"],
        }).execute()

        new_count += 1
        print(f"  ✓ Загружен {post_id}")

    print(f"\n✓ Синхронизация завершена: {new_count} новых, {len(existing_ids)} уже было")


def main():
    print(f"=== Синхронизация Instagram @{TARGET_PROFILE} → Supabase ===\n")

    cl = login_instagram()
    posts = fetch_posts(cl)

    if not posts:
        print("Нет постов для синхронизации")
        return

    sync_to_supabase(posts)


if __name__ == "__main__":
    main()
