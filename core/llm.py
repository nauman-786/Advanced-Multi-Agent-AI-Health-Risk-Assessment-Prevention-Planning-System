import os
import logging
import time
import requests
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables from the .env file
load_dotenv()

def ask_claude(system_prompt: str, user_message: str) -> str:
    """
    A central wrapper that routes requests to the Groq API.
    We keep the function name 'ask_claude' so we don't have to break the 
    rest of the PRESAGE system architecture blueprint.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable not set")
    
    # Using Groq API (compatible with OpenAI format)
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    model_candidates = [
        "llama-3.3-70b-versatile",
        "openai/gpt-oss-120b",
        "llama-3.1-8b-instant"
    ]
    payload = {
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        "max_tokens": 1024,
        "temperature": 0.2
    }
    
    last_error = None
    max_attempts = 5
    initial_backoff = 1

    for model in model_candidates:
        payload["model"] = model
        logger.debug(f"Making Groq API request to {url}")
        logger.debug(f"Using model: {model}")

        for attempt in range(1, max_attempts + 1):
            try:
                response = requests.post(url, headers=headers, json=payload, timeout=60)
                logger.debug(f"Response status: {response.status_code}")
                logger.debug(f"Response text: {response.text[:500]}")

                if response.status_code == 200:
                    return response.json()["choices"][0]["message"]["content"]

                if response.status_code == 429:
                    if attempt == max_attempts:
                        logger.error("Rate limit exceeded after repeated retries.")
                        response.raise_for_status()
                    sleep_time = min(initial_backoff * (2 ** (attempt - 1)), 16)
                    logger.warning(f"Rate limited by Groq API (429). Retrying in {sleep_time}s... attempt {attempt}/{max_attempts}")
                    time.sleep(sleep_time)
                    continue

                if response.status_code in {400, 404}:
                    if "decommissioned" in response.text.lower() or "model" in response.text.lower() or "not found" in response.text.lower():
                        logger.warning(f"Model {model} unsupported, trying next fallback.")
                        last_error = response
                        break

                response.raise_for_status()
                return response.json()["choices"][0]["message"]["content"]
            except requests.exceptions.HTTPError as e:
                logger.error(f"HTTP Error: {e}")
                logger.error(f"Response: {e.response.text if hasattr(e, 'response') else 'No response'}")
                last_error = e
                if response is not None and response.status_code in {400, 404}:
                    break
                raise
            except Exception as e:
                logger.error(f"Error calling Groq API: {e}")
                last_error = e
                break

    if last_error:
        raise last_error
    raise RuntimeError("Unable to complete Groq API request")
