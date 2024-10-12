```markdown
# Gemini Chatbot Interface

This repository contains a basic frontend for the **Gemini Chatbot**, an AI-powered conversational assistant. The interface is built using HTML, CSS, and JavaScript, and it integrates with Google Gemini models to handle chat-based interactions.

## Features

- **Model Selection**: Choose between different AI models (Gemini Pro and Gemini Flash).
- **Chat Interface**: A user-friendly chat interface with support for text-based inputs.
- **Suggestions**: Quick suggestions for common user queries.
- **Theme Toggle**: Switch between light and dark modes.
- **Local Storage**: Save chat history and settings in the browser's local storage.
- **Dynamic Loading**: Displays responses from the Gemini models with a typing effect.

## Files Overview

### 1. `index.html`

- The main structure of the chatbot interface.
- Includes an interactive sidebar for selecting models and viewing chat history.
- Contains a header with dynamic suggestions and a form for entering prompts.

### 2. `style.css`

- Defines the styles for the chatbot interface, including both light and dark modes.
- Customizes the layout and appearance of various components such as the sidebar, chat bubbles, and buttons.
- Implements responsive design to ensure compatibility across different devices.

### 3. `script.js`

- Handles the core functionality of the chatbot:
  - Manages chat history and interactions with the Gemini API.
  - Implements local storage to save chats and user settings.
  - Provides functions for theme toggling, sidebar management, and message rendering.
  - Sends requests to the Gemini API and displays responses with a typing effect.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/gemini-chatbot.git
   cd gemini-chatbot
   ```

2. Open the `index.html` file in your web browser to view the chatbot interface.

3. Ensure you have an API key for Google Gemini and replace the placeholder key in `script.js`:
   ```javascript
   const API_KEY = "YOUR_GOOGLE_GEMINI_API_KEY";
   ```

4. Customize the chatbot behavior and appearance by modifying the `style.css` and `script.js` files as needed.

## Usage

- Select a model from the sidebar.
- Type a query in the input field and click the **send** button to receive a response.
- Click on the predefined suggestions for quick queries.
- Use the theme toggle button to switch between light and dark modes.

## Dependencies

- Google Fonts (Poppins)
- Highlight.js (for syntax highlighting)
- Marked.js (for Markdown parsing)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
```

This `README.md` provides an overview of the repository contents, explains key features, and offers instructions on setup and usage. Feel free to modify it as needed!
