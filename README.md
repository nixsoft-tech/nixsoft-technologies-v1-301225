# Nixsoft Technologies - Corporate Website

This repository contains the source code for the Nixsoft Technologies corporate website, featuring an AI-powered assistant for client engagement.

## Features

- **Enterprise DevOps & Cloud Solutions**
- **Security & Compliance Monitoring**
- **AI-Powered Support Bot (NixBot)**
- **Responsive Modern Design**

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. For the NixBot chat, put `XAI_API_KEY` (Grok) and/or `DEEPSEEK_API_KEY` in `server/.env`
   (along with `ADMIN_PASSWORD`) and start the backend: `cd server && npm install && npm start`.
   Keys never go in `.env.local`, which is bundled into the browser.
3. Run the app:
   `npm run dev`
