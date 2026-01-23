# System Architecture - Trait-Based Student Simulation

## Overview

This application uses a **trait-based personality system** where each AI student is defined by numerical scales (1-5) across seven dimensions, rather than hardcoded descriptive prompts.

## How It Works

### Frontend (index.html, student-panel.html)
- **NO hardcoded system prompts** - all personality definitions are in markdown files
- Sends only: `character` name and `message` to backend
- Displays responses from 5 different AI students

### Backend (server.js)
1. Receives character name and user message
2. **Dynamically loads** character personality from markdown files:
   - `characters/SYSTEM_INSTRUCTION.md` (base instructions for all students)
   - `characters/{CHARACTER_NAME}.md` (specific trait profile)
3. Combines them into a complete system prompt
4. Sends to Gemini API
5. Returns response to frontend

### Character Files Structure

Each character has a markdown file with:

#### 1. Trait Profile Table
```markdown
| Trait | Score | Interpretation |
|-------|-------|----------------|
| Processing Speed | 3 | Average comprehension |
| Energy Level | 5 | Extremely high energy |
| Feedback Frequency | 4 | Frequently seeks feedback |
| Effort Tolerance | 3 | Moderate effort |
| Cognitive Style | 2 | Prefers concrete examples |
| Compliance | 4 | Cooperative |
| Attention Span | 1 | Easily distracted |
```

#### 2. Behavioral Patterns
- How each trait manifests in conversation
- Example interactions
- Teaching challenges created
- Success indicators

#### 3. Personality Summary
- Natural language description of how traits combine
- Core essence of the character
- What NOT to do

## The Seven Traits

1. **Processing Speed** - How quickly they understand concepts
2. **Energy Level** - Enthusiasm and engagement level
3. **Feedback Frequency** - How often they seek validation
4. **Effort Tolerance** - Willingness to work through difficulty
5. **Cognitive Style** - Preference for examples vs. theory
6. **Compliance** - Cooperation vs. opposition to teaching
7. **Attention Span** - Ability to stay focused

## Character Mappings

```javascript
'jamie' → JAMIE_BEAVER.md
'thomas' → THOMAS_GOOSE.md
'sam' → SAM_SLOTH.md
'alex' → ALEX_CROCODILE.md
'avery' → AVERY_PENGUIN.md
```

## System Prompt Generation

The backend creates the final system prompt by combining:

```
[SYSTEM_INSTRUCTION.md]
  +
[Character-specific .md file]
  +
[Brief formatting instructions]
  =
Complete system prompt sent to Gemini API
```

## Benefits of This Architecture

✅ **Separation of Concerns**: Personality definitions separate from code
✅ **Easy Updates**: Change character behavior by editing markdown files
✅ **Consistency**: All characters use same base instruction system
✅ **Scalability**: Add new characters by creating new markdown files
✅ **Version Control**: Track personality changes through git history
✅ **Documentation**: Markdown files serve as both config AND documentation

## Making Changes

### To modify a character's personality:
1. Edit `characters/{CHARACTER_NAME}.md`
2. Restart the server
3. New behavior takes effect immediately

### To add a new character:
1. Create `characters/NEW_CHARACTER.md` with trait profile
2. Add mapping to `server.js`: `CHARACTER_FILES` object
3. Update frontend `characters` array in HTML files
4. Add character panel to HTML

### To change base instructions:
1. Edit `characters/SYSTEM_INSTRUCTION.md`
2. Affects ALL characters

## Technical Flow

```
User sends message
    ↓
Frontend: POST /api/generate {character, message}
    ↓
Backend: Load SYSTEM_INSTRUCTION.md
Backend: Load {CHARACTER}.md
Backend: Combine into system prompt
    ↓
Backend: Call Gemini API with system prompt + message
    ↓
Backend: Return AI response
    ↓
Frontend: Display in character's panel
```

## Security

- API key stored in `.env` file on server
- Never exposed to frontend or browser
- Markdown files loaded server-side only
- Frontend has no access to system prompts

---

**Philosophy**: Avoid direct descriptions. Instead, map personality through numerical scales that combine to create emergent behavior. The traits define the character, not pre-written dialogue patterns.
