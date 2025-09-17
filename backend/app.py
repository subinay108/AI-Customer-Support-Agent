from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
import os

# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Initialize FastAPI app
app = FastAPI()

# Allow CORS (important for frontend-backend communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat_endpoint(chat_request: ChatRequest):
    """
    Endpoint to handle chat requests
    """
    try:
        # Send message to Groq API
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": chat_request.message}],
            model="llama-3.3-70b-versatile",
        )

        # Extract response
        response = chat_completion.choices[0].message.content

        return {"response": response}

    except Exception as e:
        return {"error": str(e)}
