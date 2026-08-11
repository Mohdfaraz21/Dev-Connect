# Universal Interview Preparation Prompt for Full-Stack Projects

Use this prompt with ChatGPT (or any LLM) after giving it access to your project codebase. It will analyze your project deeply and prepare you for technical interviews.

---

## How to Use

1. Open your project in your code editor
2. Copy the entire prompt below
3. Paste it into ChatGPT along with your project context
4. The AI will read your code and generate a comprehensive interview preparation document

---

## The Prompt

```
You are a senior software architect and technical interviewer. I need you to perform a deep-dive analysis of my project and prepare me for technical interviews. I will give you access to my codebase. Your job is to understand EVERY detail of how this application works and generate a comprehensive interview preparation guide.

## Your Analysis Must Cover:

### 1. PROJECT OVERVIEW
- What does this application do? What problem does it solve?
- Who are the target users?
- What are the core features and functionalities?

### 2. TECH STACK & ARCHITECTURE
- List all technologies, frameworks, libraries used (frontend + backend + database + tools)
- Explain why these choices were made
- Describe the overall system architecture (monolith, microservices, serverless, etc.)
- Explain the folder/project structure and why it's organized that way
- Identify the architectural patterns used (MVC, component-based, etc.)

### 3. DATABASE DESIGN
- List all database models/collections/schemas
- For each model: fields, data types, validation rules, relationships
- Explain indexes and why they exist
- Describe any database constraints or unique keys
- Explain the data flow between models

### 4. AUTHENTICATION & AUTHORIZATION
- How does auth work? (JWT, sessions, OAuth, etc.)
- What is the auth flow from login to protected routes?
- How are passwords stored and verified?
- What middleware/guards protect routes?
- How is user identity maintained across requests?

### 5. API DESIGN
- List ALL API endpoints with HTTP methods
- For each endpoint: purpose, request format, response format, auth required?
- Explain REST conventions followed (or not followed)
- Describe how errors are handled
- Explain any custom response formats

### 6. STATE MANAGEMENT (Frontend)
- How is state managed? (Redux, Context API, local state, etc.)
- What slices/stores exist and what data do they hold?
- How does data flow from API → store → components?
- Explain any caching or data persistence strategies

### 7. ROUTING & NAVIGATION
- How are routes structured?
- What are all the routes/pages in the application?
- How is routing protected? (auth guards, role-based access)
- How does navigation work between pages?

### 8. THIRD-PARTY INTEGRATIONS
- What external services are integrated? (payment gateways, email services, auth providers, etc.)
- How does each integration work?
- What credentials/API keys are needed?
- How are webhooks handled if applicable?

### 9. KEY FEATURES - DEEP DIVE
Pick the 3-5 most important features and explain each in detail:
- How is it implemented?
- What files/components are involved?
- What is the data flow?
- What edge cases are handled?
- How could it be improved?

### 10. SECURITY IMPLEMENTATION
- What security measures are in place?
- How is sensitive data protected?
- What validation exists?
- How are attacks prevented (XSS, CSRF, SQL injection, etc.)?
- What security gaps exist?

### 11. ERROR HANDLING & LOGGING
- How are errors caught and handled?
- Are there global error handlers?
- What logging exists?
- How are errors communicated to the user?

### 12. PERFORMANCE CONSIDERATIONS
- What performance optimizations are implemented?
- How is data fetched? (pagination, caching, lazy loading)
- Are there any potential performance bottlenecks?
- How could performance be improved?

### 13. DEPLOYMENT & ENVIRONMENT
- What environment variables are needed?
- How is the app configured for different environments?
- What is the deployment strategy?
- What build processes exist?

### 14. CODE QUALITY & MAINTAINABILITY
- What coding standards are followed?
- Are there any design patterns used?
- How is code reusability handled?
- What technical debt exists?

## Interview Preparation Section

Generate a comprehensive Q&A document covering:

### Common Interview Questions (with detailed answers based on THIS project):
1. "Tell me about yourself and your project"
2. "What is the architecture of your application?"
3. "How does authentication work in your app?"
4. "How do you handle data validation?"
5. "How do you manage state in the frontend?"
6. "Explain the payment flow in your application"
7. "How do you handle errors?"
8. "What challenges did you face and how did you solve them?"
9. "How would you scale this application?"
10. "What would you improve if you had more time?"
11. "How do you ensure security in your application?"
12. "Explain the database design and relationships"
13. "How do you handle real-time features?" (if applicable)
14. "What testing strategies do you use?"
15. "How do you handle API versioning and backward compatibility?"

### Technical Deep-Dive Questions:
- "Walk me through what happens when a user clicks [specific action]"
- "How does data flow from the database to the UI?"
- "Explain the most complex piece of code in your project"
- "How would you add a new feature to this architecture?"
- "What design patterns did you use and why?"
- "How do you handle concurrent requests/race conditions?"
- "Explain the caching strategy (if any)"

### System Design Questions (based on this project):
- "How would you redesign this for 1 million users?"
- "How would you add real-time chat to this application?"
- "How would you implement a notification system?"
- "How would you handle file uploads?"
- "How would you add multi-tenancy?"

## Output Format

Please structure your response as follows:

### PART 1: COMPLETE PROJECT ANALYSIS
[All sections from 1-14 above with detailed analysis]

### PART 2: INTERVIEW Q&A
[All common questions with detailed, project-specific answers]

### PART 3: CODE WALKTHROUGHS
[Line-by-line or section-by-section explanation of critical code paths]

### PART 4: IMPROVEMENTS & SCALING
[What could be improved, how to scale, what to add next]

### PART 5: QUICK REFERENCE CHEAT SHEET
[One-page summary of key points to remember for interviews]

## Important Instructions:
- Read ALL files in the codebase thoroughly
- Do not skip any files - even small utility files matter
- Be extremely specific to THIS project - use actual file names, function names, line numbers
- Explain concepts in simple terms with analogies where helpful
- Prepare me to answer ANY question an interviewer could ask about this project
- I should be able to explain this project to anyone confidently after reading your response
```

---

## How to Use This Prompt

### Step 1: Prepare Your Codebase
Make sure your code is:
- Well-organized in folders
- Has clear file naming
- Is accessible to the AI (either uploaded or in a shared workspace)

### Step 2: Provide Context
When using the prompt, also share:
- Project name and one-line description
- Tech stack (if not obvious from code)
- Any specific areas you're worried about

### Step 3: Generate the Document
Paste the prompt + your project into ChatGPT. It will generate a comprehensive interview prep document.

### Step 4: Practice
- Read through the generated Q&A
- Practice explaining your project out loud
- Focus on the "Tell me about yourself" and "Walk me through your project" answers
- Be ready to dive deep into any feature

---

## Pro Tips for Interviews

1. **Start with the big picture** - Always begin by explaining what the app does and why you built it
2. **Know your tech choices** - Be ready to explain why you chose React over Vue, MongoDB over SQL, etc.
3. **Be honest about tradeoffs** - Every decision has pros/cons. Know yours.
4. **Prepare a 2-minute and a 10-minute version** of your project explanation
5. **Know your metrics** - Lines of code, number of features, API endpoints, etc.
6. **Be ready to whiteboard** - The architecture diagram should be clear in your mind
7. **Practice explaining complex features simply** - If you can't explain it simply, you don't understand it well enough

---

## Example Usage

**You:** "I want to prepare for interviews about my project DevConnect. Here's my codebase: [codebase context]. [paste the prompt above]"

**ChatGPT will:**
1. Analyze your entire codebase
2. Generate a comprehensive interview prep document
3. Give you project-specific Q&A
4. Help you understand your own project better

---

## Saving This Prompt

Save this file as `INTERVIEW_PREP_PROMPT.md` in your project root. You can reuse it for:
- Current project interview prep
- Future projects (just change the codebase context)
- Explaining your project to others
- Writing documentation

---

Generated by Kilo Code
Project: DevConnect
Date: 2026-08-11
