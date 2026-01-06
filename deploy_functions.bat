@echo off
echo Deploying r2-storage function...
call npx supabase functions deploy r2-storage --no-verify-jwt
if %errorlevel% neq 0 (
    echo Deployment failed. Please ensure you are logged in via 'npx supabase login'.
    pause
    exit /b %errorlevel%
)
echo Deployment successful!
pause
