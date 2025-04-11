# Best Practices for Interacting with GitHub Copilot

## General Tips

*   **Be Specific:** Clearly state what you want Copilot to do. Instead of "write code," try "write a Python function to read a CSV file and return a list of dictionaries."
*   **Provide Context:** Copilot works best when it understands the surrounding code. Ensure the active file or selected code provides enough context for your request.
*   **Break Down Complex Tasks:** For large or complex features, ask for smaller, manageable pieces of code first.
*   **Review Suggestions:** Always review Copilot's suggestions carefully. It's a tool to assist you, not replace your judgment. Ensure the code is correct, secure, and meets your requirements.
*   **Use Comments:** Write clear comments in your code. Copilot uses these to understand your intent.
*   **Iterate:** If the first suggestion isn't perfect, refine your prompt or ask for alternatives. You can say "make it more efficient," "add error handling," or "use a different approach."

## Code Generation

*   **Specify Language:** While Copilot often infers the language, explicitly mentioning it helps (e.g., "Generate a JavaScript function...").
*   **Describe Inputs and Outputs:** Clearly define function parameters, return types, and expected behavior.
*   **Mention Libraries/Frameworks:** If you want code using specific libraries (e.g., React, Pandas), mention them in your prompt.
*   **Example:** "Create a TypeScript interface `UserProfile` with `id` (number), `name` (string), and `email` (optional string)."

## Explaining Code (`/explain`)

*   **Select Code First:** Select the specific code block you want explained before using the `/explain` command or asking "Explain this code."
*   **Ask Focused Questions:** Instead of just "explain," ask specific questions like "Explain how this algorithm works," "What does this regular expression do?", or "Why is this variable used here?"

## Fixing & Refactoring Code (`/fix`)

*   **Select the Problematic Code:** Highlight the code that has errors or needs improvement.
*   **Describe the Issue:** Briefly explain the error message or the desired improvement (e.g., "Fix the syntax error in this selection," "Refactor this code to be more readable," "Optimize this loop.").

## Generating Unit Tests (`/tests`)

*   **Select the Code to Test:** Select the function or class you want to generate tests for.
*   **Specify Framework (Optional):** If you prefer a specific testing framework (e.g., Jest, Pytest), mention it. "Generate Jest unit tests for the selected function."
*   **Mention Edge Cases (Optional):** You can guide Copilot by suggesting specific scenarios to test (e.g., "Include tests for null inputs and empty arrays.").

## Asking Questions

*   **Workspace Questions (`@workspace`):** Use `@workspace` to ask questions about your project files. Examples:
    *   `@workspace Where is the User model defined?`
    *   `@workspace Summarize the purpose of the payment processing module.`
    *   `@workspace What libraries are used for API calls?`
*   **VS Code Questions (`@vscode`):** Ask how to perform actions within the IDE. Examples:
    *   `@vscode How do I change the color theme?`
    *   `@vscode What's the shortcut for multi-cursor editing?`
*   **Terminal Questions (`@terminal`):** Ask for help with terminal commands or explain terminal output. Examples:
    *   `@terminal How do I list files sorted by modification date?`
    *   `@terminal Explain the error message in the last command.`
    *   `@terminal Suggest a fix for the command that failed.`

By following these guidelines, you can interact more effectively with GitHub Copilot and get better, more relevant assistance.