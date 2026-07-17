#!/bin/bash

# LearnForge AI Deployment Script
# Automates Supabase Edge Function deployment, secrets setting, and Firebase Hosting staging.

echo "===================================================="
echo "🚀 Starting LearnForge AI Production Deployment..."
echo "===================================================="

# Load environment variables from backend/.env if it exists
if [ -f backend/.env ]; then
  export $(cat backend/.env | xargs)
fi

# 1. Firebase Frontend Build and Deploy
echo "📦 Building React frontend..."
npm install
npm run build

echo "🔥 Deploying frontend to Firebase Hosting..."
firebase deploy --only hosting

# 2. Deploy Supabase Edge Functions
echo "⚡ Deploying Supabase Edge Functions..."
supabase functions deploy generate-learning --project-ref "$SUPABASE_PROJECT_ID"

# 3. Set Production secrets in Supabase Edge Functions
echo "🔐 Setting environment secrets in Supabase..."
supabase secrets set \
  GEMINI_API_KEY="$GEMINI_API_KEY" \
  GROQ_API_KEY="$GROQ_API_KEY" \
  OPENROUTER_API_KEY="$OPENROUTER_API_KEY" \
  DEEPSEEK_API_KEY="$DEEPSEEK_API_KEY" \
  RESEND_API_KEY="$RESEND_API_KEY" \
  CLOUDINARY_CLOUD_NAME="$CLOUDINARY_CLOUD_NAME" \
  CLOUDINARY_API_KEY="$CLOUDINARY_API_KEY" \
  CLOUDINARY_API_SECRET="$CLOUDINARY_API_SECRET" \
  --project-ref "$SUPABASE_PROJECT_ID"

echo "===================================================="
echo "🎉 LearnForge AI deployment workflow finished!"
echo "===================================================="
