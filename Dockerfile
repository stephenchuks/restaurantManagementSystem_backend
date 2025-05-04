# 1) Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# copy package manifests
COPY package.json ./

# install both prod & dev deps so we can build
RUN npm install

# compile TS → JS
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# 2) Runtime stage
FROM node:18-alpine AS runner
WORKDIR /app

# copy only prod deps & built output
COPY package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY .env.example .env

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/server.js"]
