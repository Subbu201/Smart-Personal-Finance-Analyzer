@echo off
REM Smart Finance Analyzer - Spring Boot Build and Run Script for Windows

echo.
echo ================================================
echo Smart Finance Analyzer - Spring Boot Backend
echo ================================================
echo.

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java is not installed or not in PATH
    echo Please install Java 17 or higher from: https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)

REM Check if Maven is installed
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Maven is not installed or not in PATH
    echo Please install Maven from: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

echo ✅ Java and Maven found
echo.
echo Building Spring Boot application...
echo.

REM Build the application
cd backend-spring
mvn clean package -DskipTests

if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo ✅ Build successful
echo.
echo Starting Spring Boot application...
echo.

REM Run the application
java -jar target/smart-finance-analyzer-1.0.0.jar

pause
