# UniSticker Chat Service

WebSocket-based chat service powered by Mistral AI for the UTM Vehicle Sticker Application System.

## Features

- Real-time WebSocket communication
- AI-powered responses using Mistral AI
- Dynamic system prompt based on user context
- Automatic guide content integration
- Streaming response support

## Prerequisites

- Python 3.8 or higher
- Mistral AI API key
- WebSocket client (frontend)

## Setup

1. Create and activate virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
- Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
- Update the following variables:
  ```
  MISTRAL_API_KEY=your_mistral_api_key_here
  PORT=8080
  HOST=127.0.0.1
  NODE_ENV=development
  ```

4. Start the server:
```bash
python main.py
```

The WebSocket server will be available at `ws://localhost:8080`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MISTRAL_API_KEY | Mistral AI API key | Required |
| PORT | WebSocket server port | 8080 |
| HOST | WebSocket server host | 127.0.0.1 |
| NODE_ENV | Environment | development |

## WebSocket Events

### Client to Server
```javascript
{
  "type": "message",
  "message": "user question here",
  "user": {
    "name": "User Name",
    "role": "Student/Staff",
    "additional_info": "Additional context"
  }
}
```

### Server to Client
```javascript
{
  "type": "message",
  "content": "AI response here"
}
```

## Guide Integration

The chat service automatically:
1. Loads content from `docs/sticker_application_guide.md`
2. Parses sections based on headers
3. Matches user questions with relevant guide sections
4. Provides context-aware responses

## Error Handling

The service handles:
- Connection errors
- Authentication failures
- Rate limiting
- Invalid message formats
- AI service disruptions

## Contributing

1. Follow Python PEP 8 style guide
2. Add error handling for new features
3. Update requirements.txt for new dependencies
4. Test WebSocket connections thoroughly

## Related Services

- Frontend: Next.js application at `http://localhost:3000`
- Backend: Laravel API at `http://localhost:8000`
