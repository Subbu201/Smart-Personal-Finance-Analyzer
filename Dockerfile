FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy entire repo
COPY . .

# Install Node.js for frontend build
RUN apt-get update && apt-get install -y nodejs npm && rm -rf /var/lib/apt/lists/*

# Run your build script
RUN npm install --prefix frontend-react && \
    npm run build --prefix frontend-react && \
    rm -rf backend-spring/src/main/resources/static && \
    mkdir -p backend-spring/src/main/resources/static && \
    cp -r frontend-react/build/* backend-spring/src/main/resources/static && \
    cd backend-spring && \
    mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder /app/backend-spring/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
