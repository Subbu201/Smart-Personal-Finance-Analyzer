# Environment Variables Setup

This project uses environment variables for sensitive credentials. All credentials are stored in the `.env` file (which is git-ignored) and should NOT be committed to version control.

## Setup Instructions

### 1. Create `.env` File
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Then edit `.env` and add your actual credentials:
```properties
PORT=8080
DB_URL=jdbc:mysql://your-database-host/database-name
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
JWT_SECRET=your-secret-key
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com
```

### 2. For Local Development

#### Windows (PowerShell):
```powershell
$env:DB_URL="jdbc:mysql://yamanote.proxy.rlwy.net:57916/railway"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_password"
$env:MAIL_USERNAME="smartfinanceanalyzer@gmail.com"
$env:MAIL_PASSWORD="yaxp zkvs btai ahhk"
$env:JWT_SECRET="your-secret-key"

mvn spring-boot:run
```

#### Linux/Mac (Bash):
```bash
export DB_URL="jdbc:mysql://yamanote.proxy.rlwy.net:57916/railway"
export DB_USERNAME="root"
export DB_PASSWORD="your_password"
export MAIL_USERNAME="smartfinanceanalyzer@gmail.com"
export MAIL_PASSWORD="yaxp zkvs btai ahhk"
export JWT_SECRET="your-secret-key"

mvn spring-boot:run
```

### 3. For Deployment (Production)

Set these environment variables in your deployment platform:
- **Railway/Heroku/AWS**: Use the platform's environment variable settings
- **Docker**: Use `-e` flag or add to `.env` file in Docker
- **Kubernetes**: Use ConfigMap and Secrets

Example for Docker:
```bash
docker run -e DB_URL="..." -e DB_USERNAME="..." -e MAIL_PASSWORD="..." your-app:latest
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 8080 |
| `DB_URL` | MySQL database URL | jdbc:mysql://localhost:3306/smart_finance |
| `DB_USERNAME` | Database username | root |
| `DB_PASSWORD` | Database password | (empty) |
| `JWT_SECRET` | JWT signing secret | default-dev-key |
| `MAIL_HOST` | SMTP server | smtp.gmail.com |
| `MAIL_PORT` | SMTP port | 587 |
| `MAIL_USERNAME` | Email account | smartfinanceanalyzer@gmail.com |
| `MAIL_PASSWORD` | Email app password | (empty) |
| `MAIL_FROM` | Sender email | smartfinanceanalyzer@gmail.com |

## Security Notes

⚠️ **IMPORTANT**:
- ✅ `.env` file is in `.gitignore` - will NOT be committed
- ✅ `.env.example` is committed - shows required variables
- ✅ All sensitive data stays out of version control
- ⚠️ Keep `.env` file safe and never share credentials

## Troubleshooting

**Issue**: "Failed to send OTP email"
- Check `MAIL_PASSWORD` is correct (use Gmail App Password, not regular password)
- Verify `MAIL_USERNAME` is correct

**Issue**: "Failed to determine a suitable driver class"
- Check `DB_URL` format is correct
- Verify MySQL credentials in `DB_USERNAME` and `DB_PASSWORD`

## For GitHub/Deployment

1. **Commit to GitHub**: ONLY commit `.env.example`, NOT `.env`
2. **In Deployment Platform**: Set the environment variables directly (don't use .env file)
3. **Local Development**: Copy `.env.example` to `.env` and fill in credentials
