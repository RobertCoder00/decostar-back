FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  && npm install -g @nestjs/cli \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .

# RUN npx prisma generate

EXPOSE 4000

CMD ["sh", "-c", "npm start"]
