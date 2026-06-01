#!/usr/bin/env python3

import os
import sys
from pathlib import Path
from typing import Optional

try:
    import paramiko
    from dotenv import load_dotenv
except ImportError:
    print("Dependências ausentes. Execute:")
    print("  pip install -r scripts/requirements.txt")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

VPS_HOST = os.getenv("VPS_HOST")
VPS_PORT = int(os.getenv("VPS_PORT", "22"))
VPS_USER = os.getenv("VPS_USER")
VPS_PASSWORD = os.getenv("VPS_PASSWORD")
VPS_PROJECT_PATH = os.getenv("VPS_PROJECT_PATH", "/telasdosul.com.br-backend")
VPS_PM2_PROCESS_NAME = os.getenv("VPS_PM2_PROCESS_NAME", "backend-telas-sul")
VPS_GIT_BRANCH = os.getenv("VPS_GIT_BRANCH", "main")


def require_env(name: str, value: Optional[str]) -> str:
    if not value:
        print(f"Erro: variável {name} não definida no .env")
        sys.exit(1)
    return value


VPS_HOST = require_env("VPS_HOST", VPS_HOST)
VPS_USER = require_env("VPS_USER", VPS_USER)
VPS_PASSWORD = require_env("VPS_PASSWORD", VPS_PASSWORD)

REMOTE_COMMANDS = " && ".join(
    [
        "set -e",
        f"cd {VPS_PROJECT_PATH}",
        f"git pull origin {VPS_GIT_BRANCH}",
        "npx prisma generate",
        "npm run build",
        f"pm2 restart {VPS_PM2_PROCESS_NAME}",
    ]
)


def run_deploy() -> None:
    target = f"{VPS_USER}@{VPS_HOST}"
    print(f"Deploy em {target}:{VPS_PROJECT_PATH} (branch {VPS_GIT_BRANCH})...")

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        client.connect(
            hostname=VPS_HOST,
            port=VPS_PORT,
            username=VPS_USER,
            password=VPS_PASSWORD,
            timeout=30,
            allow_agent=False,
            look_for_keys=False,
        )

        _, stdout, stderr = client.exec_command(REMOTE_COMMANDS, get_pty=True)

        while True:
            line = stdout.readline()
            if not line:
                break
            print(line, end="")

        exit_code = stdout.channel.recv_exit_status()
        error_output = stderr.read().decode()

        if error_output:
            print(error_output, file=sys.stderr)

        if exit_code != 0:
            print(f"Deploy falhou com código {exit_code}.")
            sys.exit(exit_code)

        print(f"Deploy concluído. PM2: {VPS_PM2_PROCESS_NAME}")
    finally:
        client.close()


if __name__ == "__main__":
    run_deploy()
