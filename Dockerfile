FROM node:20-alpine
RUN apk add --no-cache python3 py3-pip
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/src ./src
COPY ai-service /app/ai-service
RUN pip3 install -r /app/ai-service/requirements.txt --break-system-packages || true
EXPOSE 5000
CMD ["npm", "start"]
