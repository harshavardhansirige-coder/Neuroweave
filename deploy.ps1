# LearnForge AI Windows Deployment Script
# Automates frontend compilation, Firebase hosting deployment, Supabase migrations, and Edge Function deployment.

# Clear screen and display header
Clear-Host
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀  Welcome to the LearnForge AI Production Deployment CLI" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "This script will guide you step-by-step through deploying your application." -ForegroundColor Gray
Write-Host ""

# Load environment variables helper
function Load-EnvFile($filePath) {
    if (Test-Path $filePath) {
        $envData = @{}
        Get-Content $filePath | ForEach-Object {
            $line = $_.Trim()
            if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
                $parts = $line.Split("=", 2)
                $key = $parts[0].Trim()
                $value = $parts[1].Trim()
                # Remove quotes if present
                if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
                    $value = $value.Substring(1, $value.Length - 2)
                }
                $envData[$key] = $value
            }
        }
        return $envData
    }
    return $null
}

# 1. Load root and backend env files
$rootEnv = Load-EnvFile(".\.env")
$backendEnv = Load-EnvFile(".\backend\.env")

$projectRef = ""
if ($backendEnv -and $backendEnv["SUPABASE_URL"]) {
    $url = $backendEnv["SUPABASE_URL"]
    # Extract subdomain from e.g. https://zchpispczzafdfxvnwey.supabase.co
    if ($url -match "https://([^.]+)\.supabase") {
        $projectRef = $Matches[1]
    }
}

if (-not $projectRef -and $rootEnv -and $rootEnv["VITE_SUPABASE_URL"]) {
    $url = $rootEnv["VITE_SUPABASE_URL"]
    if ($url -match "https://([^.]+)\.supabase") {
        $projectRef = $Matches[1]
    }
}

if (-not $projectRef) {
    $projectRef = "zchpispczzafdfxvnwey" # Fallback
}

Write-Host "🔍 Auto-detected settings:" -ForegroundColor DarkYellow
Write-Host "   • Supabase Project Reference: $projectRef" -ForegroundColor Gray
Write-Host "   • Firebase Project: neuroweave-3" -ForegroundColor Gray
Write-Host ""

# Utility function for confirming step
function Confirm-Step($promptMessage) {
    $response = Read-Host "$promptMessage [Y/N]"
    if ($response.ToUpper() -eq "Y" -or $response.ToUpper() -eq "YES" -or $response -eq "") {
        return $true
    }
    return $false
}

# --- STEP 1: FRONTEND BUILD & DEPLOY ---
Write-Host "----------------------------------------------------------" -ForegroundColor Cyan
Write-Host "🎨 Step 1: Frontend Deployment (Firebase Hosting)" -ForegroundColor Cyan
Write-Host "----------------------------------------------------------"

$runStep1 = Confirm-Step "Do you want to compile and deploy the React frontend?"
if ($runStep1) {
    Write-Host "📦 Installing packages and compiling production bundle..." -ForegroundColor Yellow
    npm install
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Compilation failed. Please resolve build errors before proceeding." -ForegroundColor Red
        Exit
    }
    Write-Host "✅ Frontend built successfully." -ForegroundColor Green
    
    # Check Firebase Login
    Write-Host "🔑 Checking Firebase authorization status..." -ForegroundColor Yellow
    npx firebase login
    
    Write-Host "🔥 Deploying to Firebase Hosting..." -ForegroundColor Yellow
    npx firebase deploy --only hosting
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 Frontend deployment successful!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Firebase deployment failed. Check errors above." -ForegroundColor Red
    }
} else {
    Write-Host "⏭️ Skipping frontend deployment." -ForegroundColor DarkGray
}
Write-Host ""

# --- STEP 2: SUPABASE DATABASE MIGRATIONS ---
Write-Host "----------------------------------------------------------" -ForegroundColor Cyan
Write-Host "⚡ Step 2: Supabase Database Migrations" -ForegroundColor Cyan
Write-Host "----------------------------------------------------------"

$runStep2 = Confirm-Step "Do you want to push database migrations to Supabase?"
if ($runStep2) {
    Write-Host "🔑 Checking Supabase authentication status..." -ForegroundColor Yellow
    npx supabase login
    
    Write-Host "🔗 Linking to Supabase Project ($projectRef)..." -ForegroundColor Yellow
    npx supabase link --project-ref $projectRef
    
    Write-Host "🚀 Pushing migration schemas to production database..." -ForegroundColor Yellow
    npx supabase db push
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 Database schema migrations synced successfully!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Database schema push encountered an issue. See details above." -ForegroundColor Red
    }
} else {
    Write-Host "⏭️ Skipping database migrations." -ForegroundColor DarkGray
}
Write-Host ""

# --- STEP 3: SUPABASE EDGE FUNCTION SECRETS ---
Write-Host "----------------------------------------------------------" -ForegroundColor Cyan
Write-Host "🔐 Step 3: Configure Supabase Edge Function Secrets" -ForegroundColor Cyan
Write-Host "----------------------------------------------------------"

$runStep3 = Confirm-Step "Do you want to upload API secrets to Supabase?"
if ($runStep3) {
    if (-not $backendEnv) {
        Write-Host "❌ Unable to find backend\.env file to load secrets from." -ForegroundColor Red
    } else {
        Write-Host "🚀 Injecting system secrets to Supabase..." -ForegroundColor Yellow
        
        $gemini = $backendEnv["GEMINI_API_KEY"]
        $groq = $backendEnv["GROQ_API_KEY"]
        $openrouter = $backendEnv["OPENROUTER_API_KEY"]
        $resend = $backendEnv["RESEND_API_KEY"]
        $cloudinaryName = $backendEnv["CLOUDINARY_CLOUD_NAME"]
        $cloudinaryKey = $backendEnv["CLOUDINARY_API_KEY"]
        $cloudinarySecret = $backendEnv["CLOUDINARY_API_SECRET"]
        
        # Pass secrets as a clean array to avoid line-continuation backtick errors
        $secretArgs = @(
            "GEMINI_API_KEY=$gemini",
            "GROQ_API_KEY=$groq",
            "OPENROUTER_API_KEY=$openrouter",
            "RESEND_API_KEY=$resend",
            "CLOUDINARY_CLOUD_NAME=$cloudinaryName",
            "CLOUDINARY_API_KEY=$cloudinaryKey",
            "CLOUDINARY_API_SECRET=$cloudinarySecret"
        )
        
        npx supabase secrets set --project-ref $projectRef $secretArgs
            
        if ($LASTEXITCODE -eq 0) {
            Write-Host "🎉 Secrets successfully uploaded and securely stored in Supabase!" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Failed to configure Supabase secrets. Verify your link status or keys." -ForegroundColor Red
        }
    }
} else {
    Write-Host "⏭️ Skipping secrets setup." -ForegroundColor DarkGray
}
Write-Host ""

# --- STEP 4: DEPLOY EDGE FUNCTIONS ---
Write-Host "----------------------------------------------------------" -ForegroundColor Cyan
Write-Host "⚡ Step 4: Deploy Supabase Edge Functions" -ForegroundColor Cyan
Write-Host "----------------------------------------------------------"

$runStep4 = Confirm-Step "Do you want to deploy the 'generate-learning' Edge Function?"
if ($runStep4) {
    Write-Host "🚀 Compiling and uploading Edge Functions..." -ForegroundColor Yellow
    npx supabase functions deploy generate-learning --project-ref $projectRef
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 Edge functions successfully deployed to production!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Edge functions deployment failed." -ForegroundColor Red
    }
} else {
    Write-Host "⏭️ Skipping edge function deployment." -ForegroundColor DarkGray
}
Write-Host ""

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "🎉 LearnForge AI deployment pipeline complete!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""
pause
