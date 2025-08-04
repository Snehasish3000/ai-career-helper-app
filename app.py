from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise Exception("❌ GEMINI_API_KEY not found in .env")

# Configure Gemini with API key
genai.configure(api_key=api_key)

# Initialize model (this model works for free API keys as of now)
model = genai.GenerativeModel("gemini-1.5-flash")

# Flask setup
app = Flask(__name__)
CORS(app)

@app.route("/generate", methods=["POST"])
def generate_resume():
    try:
        data = request.json
        name = data.get("name", "Anonymous")
        education = data.get("education", "B.Tech in CSE")
        skills = data.get("skills", "Python, Java")
        request_type = data.get("type", "resume")

        # Choose prompt
        if request_type == "career":
            prompt = f"""
I am {name}, currently studying {education} with skills in {skills}.
Please generate the following:
1. Ideal AI/ML career roadmap for the next 2 years
2. 3 placement-oriented beginner project ideas
3. 5 important AI career skills I must master with learning resource suggestions
"""
        else:
            prompt = f"""
I am {name}, currently studying {education}, and my skills are {skills}.
Please provide:
1. A brief professional 2-line resume summary.
2. 3 beginner AI project ideas.
3. 5 next skills to learn for AI career.
"""

        response = model.generate_content(prompt)
        return jsonify({"output": response.text})

    except Exception as e:
        print("🔥 ERROR:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
