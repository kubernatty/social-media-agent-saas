# ARCHIVED CODE - DO NOT USE

This folder contains deprecated and legacy code that is no longer part of the active project.

## Contents:
- `standalone.html` - Old monolithic HTML application (deprecated)
- `dev-server.cjs` - Legacy Node.js server for standalone.html (deprecated)
- Various other legacy HTML files and implementations

## ⚠️ IMPORTANT WARNING:
**DO NOT USE ANY CODE FROM THIS FOLDER**

The current project uses:
- React + Vite (modern setup)
- Component-based architecture
- Development server: `npm run dev` on port 3000
- Entry point: `/index.html` → `/src/main.jsx` → `/src/App.jsx`

## Migration Notes:
All functionality from the legacy standalone.html has been migrated to React components in `/src/components/`:
- ContentGenerator.jsx
- TemplateLibrary.jsx
- ContentScheduler.jsx
- ContentAnalytics.jsx
- PersonalAI.jsx
- Settings.jsx

This archive folder exists only for historical reference and should never be used for active development.