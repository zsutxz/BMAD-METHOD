# Environment Variables Documentation

The BMad Daily Digest application uses various environment variables for configuration settings. These variables are referenced throughout the architecture document, particularly in the sections about API interactions with external services.

## Backend Environment Variables

### Play.ai API Configuration
- `PLAY_AI_BEARER_TOKEN`: Authentication token for Play.ai API
- `PLAY_AI_USER_ID`: User ID for Play.ai API
- `PLAY_AI_VOICE1_ID`: ID for primary voice used in podcast
- `PLAY_AI_VOICE1_NAME`: Name of primary voice
- `PLAY_AI_VOICE2_ID`: ID for secondary voice used in podcast
- `PLAY_AI_VOICE2_NAME`: Name of secondary voice
- `PLAY_AI_STYLE`: Style parameter for the Play.ai API

### Frontend API Configuration
- `NEXT_PUBLIC_BACKEND_API_URL`: URL to access the backend API

Note: The environment variables are managed through AWS Lambda environment variables via CDK (from local gitignored `.env` for MVP setup). 