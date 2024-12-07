from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from datetime import datetime
import json
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client with Mistral API
client = OpenAI(
    api_key=os.getenv("MISTRAL_API_KEY"),
    base_url="https://api.mistral.ai/v1"  # Mistral AI API endpoint
)

# System prompt for the chatbot
SYSTEM_PROMPT = """You are the UniSticker AI Assistant, specifically designed to help with UTM (Universiti Teknologi Malaysia) vehicle sticker applications only.

IMPORTANT: Only respond to queries related to UTM vehicle sticker applications. If a user asks about anything unrelated, politely remind them that you can only assist with UTM vehicle sticker matters.

Your specific areas of assistance are limited to:
1. Vehicle Sticker Application Process:
   - How to apply for a UTM vehicle sticker
   - Step-by-step application guidance
   - Required forms and submission process

2. Documentation Requirements:
   - List of required documents
   - Document verification process
   - Document submission guidelines

3. Application Status:
   - How to check application status
   - Processing timeframes
   - Status update inquiries

4. Sticker Collection:
   - When and where to collect the sticker
   - Collection requirements
   - Validity period

If asked about anything outside these topics, respond with:
"I apologize, but I can only assist with matters related to UTM vehicle sticker applications. For your question about [topic], please contact the relevant UTM department or visit the UTM website."

Always maintain a professional and helpful tone, and ensure all information provided aligns with UTM's official vehicle sticker policies."""

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Dict] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = {
            "websocket": websocket,
            "messages": [{"role": "system", "content": SYSTEM_PROMPT}]
        }

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]

    async def broadcast(self, message: Dict, exclude_client: str = None):
        for client_id, connection in self.active_connections.items():
            if client_id != exclude_client:
                await connection["websocket"].send_json(message)

    def get_messages(self, client_id: str):
        return self.active_connections[client_id]["messages"]

    def add_message(self, client_id: str, message: Dict):
        self.active_connections[client_id]["messages"].append(message)

manager = ConnectionManager()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            
            # Add user message to history
            user_message = {"role": "user", "content": data["message"]}
            manager.add_message(client_id, user_message)
            
            # Get conversation history
            messages = manager.get_messages(client_id)
            
            try:
                # Stream the response
                stream = client.chat.completions.create(
                    model="mistral-tiny",  # or "mistral-small" or "mistral-medium"
                    messages=messages,
                    stream=True
                )

                full_response = ""
                for chunk in stream:
                    if chunk.choices[0].delta.content is not None:
                        content = chunk.choices[0].delta.content
                        full_response += content
                        await websocket.send_json({
                            "type": "stream",
                            "token": content
                        })

                # Add AI response to history
                ai_message = {"role": "assistant", "content": full_response}
                manager.add_message(client_id, ai_message)
                
                # Send the complete response
                await websocket.send_json({
                    "type": "message",
                    "client_id": "ai",
                    "message": full_response,
                    "timestamp": datetime.now().strftime("%H:%M:%S")
                })
            
            except Exception as e:
                error_message = f"Error processing message: {str(e)}"
                await websocket.send_json({
                    "type": "error",
                    "message": error_message
                })
                continue
            
            # Broadcast user message to other clients
            await manager.broadcast(
                {
                    "type": "message",
                    "client_id": client_id,
                    "message": data["message"],
                    "timestamp": datetime.now().strftime("%H:%M:%S")
                },
                exclude_client=client_id
            )
            
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        await manager.broadcast({
            "type": "disconnect",
            "client_id": client_id,
            "message": "left the chat"
        })
