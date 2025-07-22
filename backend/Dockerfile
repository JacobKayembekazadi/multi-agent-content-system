FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create directories for logs and credentials
RUN mkdir -p /app/logs /app/credentials

# Create startup script
RUN echo '#!/bin/bash\n\
if [ ! -z "$GOOGLE_CREDENTIALS_JSON" ]; then\n\
  echo "$GOOGLE_CREDENTIALS_JSON" > /app/credentials/google-credentials.json\n\
fi\n\
exec uvicorn api_backend:app --host 0.0.0.0 --port 8000' > /app/start.sh

RUN chmod +x /app/start.sh

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Run application
CMD ["/app/start.sh"] 