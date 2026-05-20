#!/usr/bin/env python3
"""
Quick test script to verify OpenRouter API connection
"""
import os
from dotenv import load_dotenv
from core.llm import ask_claude

load_dotenv()

# Verify environment variable is loaded
api_key = os.getenv("OPENROUTER_API_KEY")
print(f"API Key loaded: {api_key[:20]}..." if api_key else "ERROR: API Key not found")

# Test the API
try:
    print("\nTesting OpenRouter API connection...")
    response = ask_claude(
        system_prompt="You are a helpful assistant. Respond briefly.",
        user_message="Say 'Hello' and nothing else."
    )
    print(f"✓ Success! Response: {response}")
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
