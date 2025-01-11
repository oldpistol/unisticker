from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Optional
from urllib.parse import parse_qs, urlparse, unquote
import json
from datetime import datetime
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

# System prompt template
SYSTEM_PROMPT_TEMPLATE = """Hi {name}!

I can help you with:
- Application process
- Documents needed
- Payment & collection
- Rules

Ask me anything about UTM vehicle sticker application."""

SYSTEM_PROMPT = """You are a dedicated support assistant for the UTM Vehicle Sticker (UniSticker) application system administrators.
Your responses must be strictly limited to topics related to:
1. UTM vehicle sticker application processes
2. System troubleshooting and technical support
3. Application status and management
4. Vehicle registration and sticker policies
5. Administrative procedures and guidelines

Format your responses using markdown:
- Use **bold** for emphasis
- Use bullet points or numbered lists for steps
- Use `code` for system terms or IDs
- Use ### for section headers
- Use > for important notes or warnings
- Use tables when comparing or listing data

If a question or topic is not related to the UniSticker system:
1. Politely inform that you can only assist with UniSticker-related matters
2. Guide the conversation back to UniSticker topics
3. Suggest relevant UniSticker-related resources or information

Remember: 
- Never provide assistance or information about topics unrelated to the UTM vehicle sticker system
- Always format responses in clear, well-structured markdown"""

# Load and parse guide content


def load_guide_content():
    try:
        with open("../docs/sticker_application_guide.md", "r", encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"Error loading guide: {e}")
        return ""


def parse_guide_sections(content):
    sections = {}
    current_section = ""
    current_content = []

    for line in content.split('\n'):
        if line.startswith('##'):
            if current_section:
                sections[current_section] = '\n'.join(current_content).strip()
            current_section = line.strip('# ')
            current_content = []
        else:
            current_content.append(line)

    if current_section:
        sections[current_section] = '\n'.join(current_content).strip()

    return sections


def find_relevant_content(query, sections):
    query = query.lower()

    # Define topic mappings
    topic_keywords = {
        "document": ["Before You Begin", "Important Notes"],
        "requirement": ["Before You Begin"],
        "apply": ["Application Steps"],
        "step": ["Application Steps"],
        "process": ["Application Steps"],
        "payment": ["Payment"],
        "collect": ["Sticker Collection"],
        "rule": ["Sticker Rules and Regulations"],
        "regulation": ["Sticker Rules and Regulations"],
        "help": ["Need Help?"],
        "support": ["Need Help?"],
        "contact": ["Need Help?"]
    }

    relevant_sections = set()

    # Find matching sections based on keywords
    for keyword, section_names in topic_keywords.items():
        if keyword in query:
            for section in section_names:
                if section in sections:
                    relevant_sections.add(section)

    # If no matches found, try to find sections containing words from the query
    if not relevant_sections:
        query_words = set(query.split())
        for section_name, content in sections.items():
            if any(word in content.lower() for word in query_words):
                relevant_sections.add(section_name)

    # Format the response
    if relevant_sections:
        response_parts = []
        for section in relevant_sections:
            response_parts.append(f"## {section}\n{sections[section]}")
        return "\n\n".join(response_parts)

    return ""


# Load guide content at startup
GUIDE_CONTENT = load_guide_content()
GUIDE_SECTIONS = parse_guide_sections(GUIDE_CONTENT)


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_info: Dict[str, dict] = {}

    async def connect(self, websocket: WebSocket, client_id: str, user_info: Optional[dict] = None):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        if user_info:
            self.user_info[client_id] = user_info

    def get_user_info(self, client_id: str) -> Optional[dict]:
        return self.user_info.get(client_id)

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
        if client_id in self.user_info:
            del self.user_info[client_id]

    async def broadcast(self, message: Dict, exclude_client: str = None):
        for client_id, connection in self.active_connections.items():
            if client_id != exclude_client:
                await connection.send_json(message)

    def get_messages(self, client_id: str):
        return self.user_info[client_id].get("messages", [])

    def add_message(self, client_id: str, message: Dict):
        if "messages" not in self.user_info[client_id]:
            self.user_info[client_id]["messages"] = []
        self.user_info[client_id]["messages"].append(message)


manager = ConnectionManager()


# Admin Connection Manager
class AdminConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.message_history: Dict[str, list] = {}

    async def connect(self, websocket: WebSocket, admin_id: str):
        await websocket.accept()
        self.active_connections[admin_id] = websocket
        self.message_history[admin_id] = []

    def disconnect(self, admin_id: str):
        if admin_id in self.active_connections:
            del self.active_connections[admin_id]

    def get_messages(self, admin_id: str) -> list:
        return self.message_history.get(admin_id, [])

    def add_message(self, admin_id: str, message: Dict):
        if admin_id not in self.message_history:
            self.message_history[admin_id] = []
        self.message_history[admin_id].append(message)


admin_manager = AdminConnectionManager()


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    try:
        # Parse user info from query parameters with proper URL decoding
        query = urlparse(str(websocket.url)).query
        params = parse_qs(query)

        # Enhanced user info parsing with URL decoding
        try:
            user_info_str = params.get('user_info', ['{}'])[0]
            # URL decode the string before parsing as JSON
            decoded_user_info = unquote(user_info_str)
            user_info = json.loads(decoded_user_info)
            print(f"[WebSocket {client_id}] Decoded user info: {user_info}")

            # Validate required fields
            required_fields = ['name', 'role', 'matricNo', 'email']
            for field in required_fields:
                if field not in user_info:
                    user_info[field] = 'N/A'
                elif not user_info[field] or user_info[field].isspace():
                    user_info[field] = 'N/A'

        except json.JSONDecodeError as e:
            print(f"[WebSocket {client_id}] Error parsing user info JSON: {e}")
            user_info = {
                'name': 'Guest User',
                'role': 'Student',
                'matricNo': 'N/A',
                'email': 'N/A'
            }
        except Exception as e:
            print(f"[WebSocket {client_id}] Error processing user info: {e}")
            user_info = {
                'name': 'Guest User',
                'role': 'Student',
                'matricNo': 'N/A',
                'email': 'N/A'
            }

        print(f"[WebSocket {client_id}] Connecting with user info: {
              user_info}")
        await manager.connect(websocket, client_id, user_info)

        # Send initial connection success message
        await websocket.send_json({
            "type": "connection_status",
            "status": "connected",
            "client_id": client_id,
            "user_info": user_info
        })

        while True:
            try:
                data = await websocket.receive_json()
                user_info = manager.get_user_info(client_id)

                if not user_info:
                    print(
                        f"[WebSocket {client_id}] Warning: No user info found, using defaults")
                    user_info = {
                        'name': 'Guest User',
                        'role': 'Guest',
                        'matricNo': 'N/A',
                        'email': 'N/A'
                    }

                # Get user details with fallbacks
                user_name = user_info.get(
                    'name', '').strip() if user_info else ''
                user_role = user_info.get(
                    'role', '').strip() if user_info else ''
                user_matric = user_info.get(
                    'matricNo', '').strip() if user_info else ''
                user_email = user_info.get(
                    'email', '').strip() if user_info else ''

                # Build additional info string
                additional_info = ""
                if user_matric and user_matric != 'N/A':
                    additional_info += f"Matric No: {user_matric}\n"
                if user_email and user_email != 'N/A':
                    additional_info += f"Email: {user_email}"

                # Create personalized system prompt
                system_prompt = SYSTEM_PROMPT_TEMPLATE.format(
                    name=user_name if user_name and user_name != 'Guest User' else 'there',
                    role=user_role if user_role != 'Guest' else 'Visitor',
                    additional_info=additional_info.strip()
                )

                print("Using system prompt:", system_prompt)  # Debug print

                # First, check if there's relevant content from the guide
                guide_content = find_relevant_content(
                    data["message"], GUIDE_SECTIONS)

                # If guide content exists, use it as context for the AI
                if guide_content:
                    messages = [
                        {"role": "system", "content": system_prompt},
                        {"role": "system", "content": f"Use this information to answer the question:\n\n{
                            guide_content}"},
                        {"role": "user", "content": data["message"]}
                    ]
                else:
                    messages = [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": data["message"]}
                    ]

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
                    ai_message = {"role": "assistant",
                                  "content": full_response}
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
                raise  # Re-raise to be caught by outer try block
            except Exception as e:
                error_message = f"Error handling message: {str(e)}"
                await websocket.send_json({
                    "type": "error",
                    "message": error_message
                })

    except WebSocketDisconnect:
        manager.disconnect(client_id)
        await manager.broadcast({
            "type": "disconnect",
            "client_id": client_id,
            "message": "left the chat"
        })
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        if client_id in manager.active_connections:
            manager.disconnect(client_id)


@app.websocket("/ws/admin/{admin_id}")
async def admin_websocket_endpoint(websocket: WebSocket, admin_id: str):
    await admin_manager.connect(websocket, admin_id)
    try:
        while True:
            message = await websocket.receive_text()
            try:
                message_data = json.loads(message)
                
                # Store admin message
                admin_manager.add_message(admin_id, {
                    "type": "message",
                    "content": message_data["content"],
                    "sender": "admin",
                    "timestamp": message_data["timestamp"]
                })

                # Broadcast admin message to all connected users
                await manager.broadcast({
                    "type": "message",
                    "content": message_data["content"],
                    "sender": "admin",
                    "timestamp": message_data["timestamp"],
                    "admin_id": admin_id
                })

                # Get AI assistant response with strict UniSticker context
                messages = [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": message_data["content"]}
                ]

                # Get response from Mistral AI
                response = client.chat.completions.create(
                    model="mistral-tiny",
                    messages=messages,
                    max_tokens=1000,
                    temperature=0.7
                )

                # Format and store AI response
                ai_response = {
                    "type": "message",
                    "content": response.choices[0].message.content,
                    "sender": "assistant",
                    "timestamp": datetime.now().isoformat()
                }
                admin_manager.add_message(admin_id, ai_response)

                # Send AI response to admin
                await websocket.send_json(ai_response)

                # Broadcast AI response to users
                await manager.broadcast({
                    **ai_response,
                    "admin_id": admin_id
                })

            except json.JSONDecodeError:
                print(f"Invalid JSON message from admin {admin_id}")
            except Exception as e:
                print(f"Error processing admin message: {str(e)}")
                
    except WebSocketDisconnect:
        admin_manager.disconnect(admin_id)
        print(f"Admin {admin_id} disconnected")
    except Exception as e:
        print(f"Unexpected error in admin websocket: {str(e)}")
        admin_manager.disconnect(admin_id)
