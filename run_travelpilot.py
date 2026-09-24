import subprocess
import time
import sys
import os

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "backend")
    frontend_dir = os.path.join(base_dir, "frontend")

    print("=" * 60)
    print("Starting TripSaathi — Intelligent Trip Planning & Disruption Agent")
    print("=" * 60)

    print("\n1. Launching FastAPI Backend on http://localhost:8000...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=backend_dir
    )

    time.sleep(2)

    print("2. Launching Vite Frontend on http://localhost:5173...")
    frontend_proc = subprocess.Popen(
        ["npm.cmd", "run", "dev"],
        cwd=frontend_dir
    )

    print("\n" + "=" * 60)
    print("TripSaathi is LIVE!")
    print("Frontend URL: http://localhost:5173")
    print("Backend API : http://localhost:8000/docs")
    print("=" * 60)
    print("Press Ctrl+C to terminate both servers.")

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down TripSaathi servers...")
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    main()
