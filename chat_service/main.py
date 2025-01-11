from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Optional
from urllib.parse import parse_qs, urlparse, unquote
import json
from datetime import datetime
import os
from dotenv import load_dotenv
from openai import OpenAI
import httpx
from typing import Dict, Optional, List, Union
import aiomysql
import pymysql

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

# Database connection pool
db_pool = None

async def init_db_pool():
    global db_pool
    db_pool = await aiomysql.create_pool(
        host=os.getenv('DB_HOST', 'localhost'),
        port=int(os.getenv('DB_PORT', 3306)),
        user=os.getenv('DB_USERNAME', 'root'),
        password=os.getenv('DB_PASSWORD', ''),
        db=os.getenv('DB_DATABASE', 'unisticker'),
        autocommit=True
    )

async def query_application_details(app_id: str) -> dict:
    """Query application details including vehicle and user information"""
    async with db_pool.acquire() as conn:
        async with conn.cursor() as cur:
            # Query application details
            await cur.execute("""
                SELECT a.*, v.vehicle_plate_no, v.vehicle_type, v.vehicle_color,
                       u.name as user_name, u.email as user_email
                FROM sticker_applications a
                JOIN vehicles v ON a.vehicle_id = v.id
                JOIN users u ON a.user_id = u.id
                WHERE a.id = %s
            """, (app_id,))
            result = await cur.fetchone()
            
            if not result:
                return {"error": "Application not found"}
            
            # Convert tuple to dict
            columns = [d[0] for d in cur.description]
            result_dict = dict(zip(columns, result))
            
            # Format dates
            for key in ['application_date', 'expiry_date', 'created_at', 'updated_at']:
                if key in result_dict and result_dict[key]:
                    result_dict[key] = result_dict[key].isoformat()
            
            return result_dict

def format_date(date_obj):
    """Format date object to string safely"""
    if not date_obj:
        return ''
    try:
        if isinstance(date_obj, str):
            # Try to parse the string to datetime first
            date_obj = datetime.fromisoformat(date_obj.replace('Z', '+00:00'))
        if isinstance(date_obj, datetime):
            return date_obj.strftime('%Y-%m-%d')
        return ''
    except (ValueError, TypeError):
        return ''

def format_datetime(dt) -> str:
    """Safely format datetime objects, returning empty string for None"""
    if dt is None:
        return ''
    try:
        if isinstance(dt, str):
            dt = datetime.fromisoformat(dt.replace('Z', '+00:00'))
        return dt.isoformat() if isinstance(dt, datetime) else ''
    except (ValueError, AttributeError):
        return ''

async def list_applications(filters: dict = None) -> List[dict]:
    """List applications with optional filters"""
    async with db_pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cur:  
            query = """
                SELECT 
                    a.*,
                    v.vehicle_plate_no,
                    u.name as user_name
                FROM sticker_applications a
                JOIN vehicles v ON a.vehicle_id = v.id
                JOIN users u ON a.user_id = u.id
                WHERE 1=1
            """
            params = []
            
            if filters:
                if filters.get('status'):
                    query += " AND a.status = %s"
                    params.append(filters['status'])
                if filters.get('user_id'):
                    query += " AND a.user_id = %s"
                    params.append(filters['user_id'])
            
            query += " ORDER BY a.created_at DESC LIMIT 10"
            
            await cur.execute(query, params)
            results = await cur.fetchall()
            
            # Process results
            processed_results = []
            for row in results:
                # Convert row to dict if it's not already (though it should be with DictCursor)
                row_dict = dict(row) if not isinstance(row, dict) else row
                
                # Format all date fields
                for field in ['application_date', 'expiry_date', 'created_at', 'updated_at']:
                    row_dict[field] = format_datetime(row_dict.get(field))
                
                processed_results.append(row_dict)
            
            return processed_results

async def search_applications(search_type: str, search_value: str) -> List[dict]:
    """Search for applications by ID, plate number, or matric number"""
    async with db_pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cur:
            query = """
                SELECT 
                    a.id,
                    a.status,
                    a.remarks,
                    a.application_date,
                    a.expiry_date,
                    a.created_at,
                    a.updated_at,
                    v.vehicle_plate_no,
                    u.name as user_name
                FROM sticker_applications a
                JOIN vehicles v ON a.vehicle_id = v.id
                JOIN users u ON a.user_id = u.id
                WHERE 1=1
            """
            params = []
            
            if search_type == "plate":
                query += " AND v.vehicle_plate_no LIKE %s"
                params.append(f"%{search_value}%")
            elif search_type == "id":
                query += " AND a.id = %s"
                params.append(search_value)
            elif search_type == "matric":
                query += " AND u.matric_id LIKE %s"
                params.append(f"%{search_value}%")
            
            await cur.execute(query, params)
            results = await cur.fetchall()
            
            processed_results = []
            for row in results:
                processed_row = {
                    'id': row['id'],
                    'user_name': row['user_name'],
                    'vehicle_plate_no': row['vehicle_plate_no'],
                    'application_date': format_date(row['application_date']),
                    'status': row['status'],
                    'expiry_date': format_date(row['expiry_date']),
                    'remarks': row['remarks'] or '',
                    'created_at': format_date(row['created_at']),
                    'updated_at': format_date(row['updated_at'])
                }
                processed_results.append(processed_row)
            
            return processed_results

async def query_user_details(search_term: str) -> Union[dict, List[dict]]:
    """Query user details by name, email, or matric number"""
    try:
        async with db_pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cur:  # Use DictCursor for automatic dict conversion
                # Query user details with a flexible search
                await cur.execute("""
                    SELECT 
                        u.id,
                        u.name,
                        u.email,
                        u.matric_id,
                        COUNT(DISTINCT sa.id) as total_applications,
                        COUNT(DISTINCT CASE WHEN sa.status = 'approved' THEN sa.id END) as approved_applications,
                        GROUP_CONCAT(DISTINCT v.vehicle_plate_no) as vehicle_plates
                    FROM users u
                    LEFT JOIN sticker_applications sa ON u.id = sa.user_id
                    LEFT JOIN vehicles v ON sa.vehicle_id = v.id
                    WHERE u.name LIKE %s 
                       OR u.email LIKE %s 
                       OR u.matric_id LIKE %s
                    GROUP BY u.id, u.name, u.email, u.matric_id
                    LIMIT 5
                """, (f"%{search_term}%", f"%{search_term}%", f"%{search_term}%"))
                
                results = await cur.fetchall()
                
                if not results:
                    return {
                        "error": f"No user found with the search term: {search_term}",
                        "suggestions": [
                            "Check if the name is spelled correctly",
                            "Try searching by email or matric ID instead",
                            "Use partial name if unsure of full name"
                        ]
                    }
                
                # Format the response
                formatted_users = []
                for user in results:
                    formatted_user = {
                        "id": user["id"],
                        "name": user["name"],
                        "email": user["email"],
                        "matric_id": user["matric_id"],
                        "total_applications": int(user["total_applications"]),
                        "approved_applications": int(user["approved_applications"]),
                        "vehicles": user["vehicle_plates"].split(',') if user["vehicle_plates"] else []
                    }
                    formatted_users.append(formatted_user)
                
                return formatted_users

    except Exception as e:
        print(f"Error in query_user_details: {str(e)}")
        return {
            "error": "Failed to retrieve user details",
            "details": str(e),
            "suggestions": [
                "Try again in a few moments",
                "Contact system administrator if the issue persists"
            ]
        }

async def handle_function_call(function_name: str, arguments: dict) -> dict:
    """Handle function calls from the AI"""
    try:
        if function_name == "search_applications":
            return await search_applications(arguments["search_type"], arguments["search_value"])
        elif function_name == "list_applications":
            return await list_applications(arguments.get("status"))
        elif function_name == "query_user_details":
            users = await query_user_details(arguments["search_term"])
            # Convert any datetime objects to strings
            if isinstance(users, list):
                for user in users:
                    for key, value in user.items():
                        if isinstance(value, datetime):
                            user[key] = value.strftime('%Y-%m-%d %H:%M:%S')
            return users
        else:
            return {"error": f"Unknown function: {function_name}"}
    except Exception as e:
        print(f"Error in handle_function_call: {str(e)}")
        return {"error": str(e)}

async def call_backend_api(endpoint: str, method: str = "GET", params: dict = None, json_data: dict = None) -> dict:
    """Call the Laravel backend API with authentication"""
    api_url = os.getenv("BACKEND_API_URL", "http://localhost:8000/api")
    admin_token = os.getenv("ADMIN_API_TOKEN")
    
    async with httpx.AsyncClient() as client:
        headers = {
            "Authorization": f"Bearer {admin_token}",
            "Accept": "application/json"
        }
        
        url = f"{api_url}/{endpoint}"
        
        try:
            if method == "GET":
                response = await client.get(url, params=params, headers=headers)
            else:
                response = await client.post(url, json=json_data, headers=headers)
                
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            print(f"HTTP error occurred: {e}")
            return {"error": str(e)}
        except Exception as e:
            print(f"Error occurred: {e}")
            return {"error": "Internal server error"}

# Initialize database pool on startup
@app.on_event("startup")
async def startup_event():
    await init_db_pool()

# Cleanup database pool on shutdown
@app.on_event("shutdown")
async def shutdown_event():
    if db_pool:
        db_pool.close()
        await db_pool.wait_closed()

# System prompt template
SYSTEM_PROMPT_TEMPLATE = """Hi {name}!

I can help you with:
- Application process
- Documents needed
- Payment & collection
- Rules
- Query application details (admin only)

Ask me anything about UTM vehicle sticker application."""

# Function definitions for Mistral AI
FUNCTIONS = [
    {
        "function": {
            "name": "search_applications",
            "description": "Search for sticker applications using various identifiers",
            "parameters": {
                "type": "object",
                "properties": {
                    "search_type": {
                        "type": "string",
                        "description": "Type of identifier to search with",
                        "enum": ["id", "plate", "matric"]
                    },
                    "search_value": {
                        "type": "string",
                        "description": "Value to search for (application ID, plate number, or matric number)"
                    }
                },
                "required": ["search_type", "search_value"]
            }
        }
    },
    {
        "function": {
            "name": "list_applications",
            "description": "List sticker applications with optional filters",
            "parameters": {
                "type": "object",
                "properties": {
                    "status": {
                        "type": "string",
                        "description": "Filter by application status (pending, approved, rejected)",
                        "enum": ["pending", "approved", "rejected"]
                    }
                }
            }
        }
    },
    {
        "function": {
            "name": "query_user_details",
            "description": "Search for user details by name, email, or matric number",
            "parameters": {
                "type": "object",
                "properties": {
                    "search_term": {
                        "type": "string",
                        "description": "Search term (name, email, or matric number)"
                    }
                },
                "required": ["search_term"]
            }
        }
    }
]

async def call_backend_api(endpoint: str, method: str = "GET", params: dict = None, json_data: dict = None) -> dict:
    """Call the Laravel backend API with authentication"""
    api_url = os.getenv("BACKEND_API_URL", "http://localhost:8000/api")
    admin_token = os.getenv("ADMIN_API_TOKEN")
    
    async with httpx.AsyncClient() as client:
        headers = {
            "Authorization": f"Bearer {admin_token}",
            "Accept": "application/json"
        }
        
        url = f"{api_url}/{endpoint}"
        
        try:
            if method == "GET":
                response = await client.get(url, params=params, headers=headers)
            else:
                response = await client.post(url, json=json_data, headers=headers)
                
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            print(f"HTTP error occurred: {e}")
            return {"error": str(e)}
        except Exception as e:
            print(f"Error occurred: {e}")
            return {"error": "Internal server error"}

# System prompt
SYSTEM_PROMPT = """You are UniSticker, a dedicated support assistant for UTM Vehicle Sticker application system administrators.

Your PRIMARY PURPOSE is to assist with vehicle sticker applications and related processes at UTM (Universiti Teknologi Malaysia).

STRICT RESPONSE POLICY:
1. ONLY respond to queries about:
   - Vehicle sticker applications and status
   - Vehicle registration processes
   - Student/Staff verification for stickers
   - Administrative tasks related to vehicle stickers
   - UTM parking policies and regulations

2. For ANY other topics (including general queries, recipes, or unrelated questions):
   - Respond with: "I apologize, but I can only assist with matters related to UTM vehicle sticker applications. Please ask about sticker applications, vehicle status, or related queries."
   - DO NOT provide any information or assistance for non-UniSticker topics

3. Keep responses focused on UTM vehicle sticker system processes and policies.

Remember: You are a specialized administrative tool, not a general assistant."""

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
        "contact": ["Need Help?"],
        "query": ["Query Application Details"],
        "application": ["Query Application Details"],
        "detail": ["Query Application Details"],
        "details": ["Query Application Details"]
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

        print(f"[WebSocket {client_id}] Connecting with user info: {user_info}")
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
                        {"role": "system", "content": f"Use this information to answer the question:\n\n{guide_content}"},
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
                        "message": full_response
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
                        "message": data["message"]
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
                data = json.loads(message)
                content = None
                
                # Handle both message formats
                if isinstance(data, dict):
                    content = data.get("message") or data.get("content")
                else:
                    content = str(data)
                
                if content:
                    # First check if the message is relevant using Mistral AI
                    relevance_check = client.chat.completions.create(
                        model="mistral-large-latest",
                        messages=[
                            {
                                "role": "system",
                                "content": """You are a vehicle sticker application system assistant. 
                                Your purpose is to determine if a user's query is related to:
                                1. Vehicle sticker applications
                                2. Application status checks
                                3. Vehicle registration
                                4. Student/Staff verification
                                5. Administrative processes related to vehicle stickers
                                
                                If a question or topic is not related to the UniSticker system:
                                1. Politely inform that you can only assist with UniSticker-related matters
                                """
                            },
                            {
                                "role": "user",
                                "content": content
                            }
                        ]
                    )
                    
                    is_relevant = relevance_check.choices[0].message.content.strip().lower() == 'true'
                    
                    # if not is_relevant:
                    #     await websocket.send_json({
                    #         "type": "message",
                    #         "content": "I can only help with questions related to vehicle sticker applications. Please ask about sticker applications, vehicle status, or related queries.",
                    #         "client_id": "ai"
                    #     })
                    #     continue

                    # Proceed with main query processing
                    response = client.chat.completions.create(
                        model="mistral-large-latest",
                        messages=[
                            {
                                "role": "system",
                                "content": SYSTEM_PROMPT
                            },
                            {
                                "role": "user",
                                "content": content
                            }
                        ],
                        tools=FUNCTIONS,
                        tool_choice="auto"
                    )
                    
                    assistant_message = response.choices[0].message
                    
                    # Handle function calls if present
                    if hasattr(assistant_message, 'tool_calls') and assistant_message.tool_calls:
                        function_responses = []
                        for tool_call in assistant_message.tool_calls:
                            try:
                                function_args = json.loads(tool_call.function.arguments)
                                
                                # Send status update
                                await websocket.send_json({
                                    "type": "message",
                                    "client_id": "system",
                                    "message": f"Querying database for {tool_call.function.name}..."
                                })
                                
                                function_response = await handle_function_call(
                                    tool_call.function.name,
                                    function_args
                                )
                                
                                # Convert any datetime objects in the response to strings
                                if isinstance(function_response, dict):
                                    for key, value in function_response.items():
                                        if isinstance(value, datetime):
                                            function_response[key] = value.strftime('%Y-%m-%d %H:%M:%S')
                                
                                function_responses.append(function_response)
                                
                            except Exception as e:
                                print(f"Function call error: {e}")
                                await websocket.send_json({
                                    "type": "message",
                                    "client_id": "system",
                                    "message": f"Error executing function: {str(e)}"
                                })
                        
                        if function_responses:
                            # Get final response with function results
                            final_response = client.chat.completions.create(
                                model="mistral-large-latest",
                                messages=[
                                    {
                                        "role": "system",
                                        "content": SYSTEM_PROMPT
                                    },
                                    {
                                        "role": "user",
                                        "content": content
                                    },
                                    {
                                        "role": "assistant",
                                        "content": assistant_message.content or "",
                                        "tool_calls": assistant_message.tool_calls
                                    },
                                    {
                                        "role": "tool",
                                        "tool_call_id": assistant_message.tool_calls[0].id,
                                        "content": json.dumps(function_responses)
                                    }
                                ]
                            )
                            
                            final_content = final_response.choices[0].message.content
                            # Send the final response
                            await websocket.send_json({
                                "type": "message",
                                "client_id": "ai",
                                "message": final_content
                            })
                    else:
                        # No function calls, just send the response
                        await websocket.send_json({
                            "type": "message",
                            "client_id": "ai",
                            "message": assistant_message.content
                        })
                else:
                    await websocket.send_json({
                        "type": "message",
                        "client_id": "system",
                        "message": "Error: No message content provided"
                    })
            except Exception as e:
                print(f"Error processing message: {e}")
                await websocket.send_json({
                    "type": "message",
                    "client_id": "system",
                    "message": f"Error: {str(e)}"
                })
    except WebSocketDisconnect:
        admin_manager.disconnect(admin_id)
