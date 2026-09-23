@echo off
echo ========================================================
echo Pushing CampusConnect Production Upgrades to GitHub
echo ========================================================

echo 1. Staging files...
git add .

echo 2. Committing changes...
git commit -m "Upgrade CampusConnect to production quality: modular architecture, dark mode, role-based access, landing page, explore catalog, and admin portal"

echo 3. Setting remote repository URL...
git remote set-url origin https://github.com/ASHUTOSH-SHUKLAA/CampusConnect.git

echo 4. Pushing to GitHub...
git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo Pushing to master branch fallback...
    git push -u origin master
)

echo ========================================================
echo Successfully pushed to GitHub repository!
echo ========================================================
pause
