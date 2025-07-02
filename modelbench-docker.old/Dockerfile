# Dockerfile
FROM python:3.13.3-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /app

# Install necessary system packages
RUN apt-get update && apt-get install -y build-essential cmake

# Copy the requirements file
COPY requirements.txt .

# Install Python dependencies using pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY modelbench.py .

# Expose the port
EXPOSE 8000

# Run the application
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-w", "2", "modelbench:app", "--bind", "0.0.0.0:8000"]