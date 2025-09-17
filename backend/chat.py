import os
from dotenv import load_dotenv
from groq import Groq

# Load .env file
load_dotenv()

# Initialize client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)

print("🤖 Chatbot is ready! Type your question (or 'exit' to quit).")

while True:
    # Take user input
    user_input = input("\nYou: ")

    # Exit condition
    if user_input.lower() in ["exit", "quit", "bye"]:
        print("🤖 Chatbot: Goodbye! 👋")
        break

    # Send to Groq API
    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "user", "content": user_input}
        ],
        model="llama-3.3-70b-versatile",
    )

    # Print response
    response = chat_completion.choices[0].message.content
    print(f"🤖 Chatbot: {response}")
