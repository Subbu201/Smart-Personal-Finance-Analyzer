@echo off
REM Load environment variables from .env file on Windows
REM Usage: env-setup.bat && mvn spring-boot:run

echo Loading environment variables from .env file...

REM Read .env file line by line
for /f "tokens=* usebackq" %%a in (.env) do (
    if not "%%a"=="" (
        if not "%%a:~0,1%"=="#" (
            setx /M %%a >nul 2>&1
            if errorlevel 1 (
                REM If setx fails (requires admin), just set locally
                set %%a
            )
            echo set %%a
        )
    )
)

echo Environment variables loaded!
echo Starting Spring Boot application...
pause
