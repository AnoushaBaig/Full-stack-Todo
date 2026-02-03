import sys
import os

# Add the backend directory to the Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

# Set the current directory to backend to help with relative imports
os.chdir(backend_dir)

# Import and run the app
from app.main import app
import uvicorn

if __name__ == "__main__":
    print("Starting backend server on http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)