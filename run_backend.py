import os
import sys
import threading
import time

# Add the project root to Python path
project_root = os.path.dirname(os.path.abspath(__file__))  # C:\Users\...\todo phase\Phase-II
backend_path = os.path.join(project_root, "backend")     # C:\Users\...\todo phase\Phase-II\backend

# Insert both paths to ensure proper imports
sys.path.insert(0, project_root)
sys.path.insert(0, backend_path)

def run_backend():
    try:
        # Change to the backend directory to ensure proper relative imports
        original_cwd = os.getcwd()
        os.chdir(backend_path)

        # Import and run the backend
        from app.main import app
        import uvicorn

        print("✅ Backend application loaded successfully!")
        print("🚀 Starting server on http://127.0.0.1:8000")
        print("📋 Available endpoints:")
        print("   • POST /auth/signup - Create new account")
        print("   • POST /auth/signin - Login to account")
        print("   • All task management endpoints")
        print("\n💡 You can now start the frontend with: npm run dev")

        uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)

    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("\nThe backend structure has complex import dependencies.")
        print("Please contact support or try the following:")
        print("1. Make sure all Python dependencies are installed")
        print("2. Check that the backend files are in the correct structure")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error running backend: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        os.chdir(original_cwd)

if __name__ == "__main__":
    run_backend()