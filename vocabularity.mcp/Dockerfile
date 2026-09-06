FROM python:3.12-slim
WORKDIR /app

ENV PYTHONUNBUFFERED=1
# Compose overrides these; 0.0.0.0 default keeps the server reachable in a container
ENV MCP_HOST=0.0.0.0
ENV MCP_PORT=9000

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 9000

CMD ["python", "main.py"]
