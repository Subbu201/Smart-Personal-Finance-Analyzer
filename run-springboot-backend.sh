#!/bin/bash

# Smart Finance Analyzer - Spring Boot Build and Run Script for Linux/Mac

echo ""
echo "================================================"
echo "Smart Finance Analyzer - Spring Boot Backend"
echo "================================================"
echo ""

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed"
    echo "Install Java 17 or higher: https://www.oracle.com/java/technologies/downloads/"
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed"
    echo "Install Maven: https://maven.apache.org/download.cgi"
    exit 1
fi

echo "✅ Java and Maven found"
echo ""
echo "Building Spring Boot application..."
echo ""

# Build the application
cd backend-spring
mvn clean package -DskipTests

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "✅ Build successful"
echo ""
echo "Starting Spring Boot application..."
echo ""

# Run the application
java -jar target/smart-finance-analyzer-1.0.0.jar
