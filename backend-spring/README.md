# Smart Finance Analyzer - Spring Boot Backend

This is the Spring Boot backend for the Smart Finance Analyzer application, migrated from Node.js/Express.

## Prerequisites

- Java 17 or higher
- Maven 3.8.1 or higher

## Project Structure

```
src/main/java/com/finance/analyzer/
├── SmartFinanceAnalyzerApplication.java   # Main Spring Boot application
├── controller/                             # REST Controllers
│   ├── AuthController.java                # Authentication endpoints
│   ├── TransactionController.java         # Transaction endpoints
│   ├── AnalyticsController.java          # Analytics endpoints
│   └── HealthController.java             # Health check endpoint
├── service/                               # Business Logic
│   ├── AuthService.java                  # Authentication service
│   ├── TransactionService.java           # Transaction service
│   ├── AnalyticsService.java            # Analytics service
│   └── DatabaseService.java              # In-memory database
├── model/                                 # Entity Models
│   ├── User.java                         # User entity
│   └── Transaction.java                  # Transaction entity
├── dto/                                   # Data Transfer Objects
│   ├── SignUpRequest.java
│   ├── LoginRequest.java
│   ├── AuthResponse.java
│   ├── UserResponse.java
│   ├── TransactionRequest.java
│   └── ApiResponse.java
├── security/                              # Security & JWT
│   ├── JwtTokenProvider.java             # JWT token generation and validation
│   ├── JwtAuthenticationFilter.java      # JWT filter
│   └── SecurityConfig.java               # Spring Security configuration
└── exception/                             # Exception Handling
    └── GlobalExceptionHandler.java       # Global exception handler
```

## Build & Run

### Build the application
```bash
mvn clean package
```

### Run the application
```bash
mvn spring-boot:run
```

Or run the JAR directly:
```bash
java -jar target/smart-finance-analyzer-1.0.0.jar
```

The server will start on `http://localhost:5000`

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /auth/signup` - Create a new account
- `POST /auth/login` - Login to account
- `POST /auth/logout` - Logout

### Transaction Endpoints
- `GET /transactions` - Get all transactions
- `GET /transactions/{id}` - Get transaction by ID
- `POST /transactions` - Add new transaction
- `PUT /transactions/{id}` - Update transaction
- `DELETE /transactions/{id}` - Delete transaction
- `GET /transactions/summary` - Get transaction summary

### Analytics Endpoints
- `GET /analytics/insights` - Get financial insights
- `GET /analytics/charts` - Get chart data

### Health Check
- `GET /health` - Check server status

## Default Credentials

For testing, use the following credentials:
- Email: `test@example.com`
- Password: `password123`

## Configuration

Edit `src/main/resources/application.properties` to modify:
- Server port (default: 5000)
- JWT secret key
- CORS origins
- Logging levels

## Database

Currently uses in-memory storage for demo purposes. To use a real database like MySQL or PostgreSQL, you'll need to:

1. Add database dependency to `pom.xml`
2. Create JPA entities with `@Entity` annotations
3. Create Spring Data JPA repositories
4. Update service classes to use repositories

## Frontend Integration

The frontend runs on `http://localhost:3000` and communicates with the backend on `http://localhost:5000/api`.

CORS is configured to allow requests from the frontend.

## Migration Notes

This Spring Boot backend is a complete rewrite of the Node.js/Express backend with:
- Same API endpoints and response formats
- Same in-memory data storage (for compatibility)
- Enhanced security with Spring Security
- Better exception handling
- Type-safe code with Java

## Development

For development with auto-reload:
```bash
mvn spring-boot:run
```

Or use an IDE like IntelliJ IDEA or Eclipse with Spring Boot support.

## License

MIT
