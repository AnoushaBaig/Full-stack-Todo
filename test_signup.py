#!/usr/bin/env python3
"""
Test script to verify the signup functionality works properly.
"""
import requests
import json

# Test the signup endpoint
def test_signup():
    print("Testing signup functionality...")

    # Test data
    signup_data = {
        "email": "testuser2@example.com",
        "password": "testpassword123"
    }

    try:
        response = requests.post(
            "http://localhost:8000/auth/signup",
            headers={"Content-Type": "application/json"},
            json=signup_data
        )

        print(f"Signup response status: {response.status_code}")
        print(f"Signup response: {response.text}")

        if response.status_code == 200:
            data = response.json()
            print("[SUCCESS] Signup successful!")
            print(f"Token: {data.get('token')[:50]}..." if data.get('token') else "No token returned")
            return True, data
        else:
            print("[ERROR] Signup failed!")
            return False, response.text

    except Exception as e:
        print(f"❌ Error during signup test: {e}")
        return False, str(e)

# Test the signin endpoint with the same credentials
def test_signin():
    print("\nTesting signin functionality...")

    # Test data
    signin_data = {
        "email": "testuser2@example.com",
        "password": "testpassword123"
    }

    try:
        response = requests.post(
            "http://localhost:8000/auth/signin",
            headers={"Content-Type": "application/json"},
            json=signin_data
        )

        print(f"Signin response status: {response.status_code}")
        print(f"Signin response: {response.text}")

        if response.status_code == 200:
            data = response.json()
            print("[SUCCESS] Signin successful!")
            print(f"Token: {data.get('token')[:50]}..." if data.get('token') else "No token returned")
            return True, data
        else:
            print("[ERROR] Signin failed!")
            return False, response.text

    except Exception as e:
        print(f"[ERROR] Error during signin test: {e}")
        return False, str(e)

if __name__ == "__main__":
    print("Testing authentication endpoints...\n")

    # First test signup
    signup_success, signup_result = test_signup()

    if signup_success:
        # Then test signin with the same credentials
        signin_success, signin_result = test_signin()

        if signin_success:
            print("\n[COMPLETE] Both signup and signin are working correctly!")
        else:
            print("\n[WARNING] Signup worked but signin failed.")
    else:
        print("\n[ERROR] Signup failed. Please check the backend server is running.")