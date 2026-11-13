FROM node:20-alpine
RUN apk add --no-cache python3 py3-pip
WORKDIR /app/backend
COPY InterviewIQ/backend/package*.json ./
RUN npm ci --omit=dev
COPY InterviewIQ/backend/src ./src
COPY InterviewIQ/ai-service /app/ai-service
RUN pip3 install -r /app/ai-service/requirements.txt --break-system-packages
EXPOSE 5000
CMD ["npm", "start"]