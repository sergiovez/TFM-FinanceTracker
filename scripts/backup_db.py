import shutil
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / 'db.sqlite3'

BACKUP_DIR = BASE_DIR / 'backups'
BACKUP_DIR.mkdir(exist_ok=True)

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
backup_file = BACKUP_DIR / f'db_backup_{timestamp}.sqlite3'

shutil.copy2(DB_PATH, backup_file)
print(f"Backup creado en {backup_file}")
