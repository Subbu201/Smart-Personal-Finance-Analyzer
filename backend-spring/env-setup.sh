#!/bin/bash
# Load environment variables from .env file on Linux/Mac
# Usage: source env-setup.sh && mvn spring-boot:run

echo "Loading environment variables from .env file..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please create .env file from .env.example"
    echo "Command: cp .env.example .env"
    exit 1
fi

# Export all variables from .env file
set -a
source .env
set +a

echo "Environment variables loaded successfully!"
echo "Starting Spring Boot application..."
