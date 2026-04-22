FROM node:22.13.0-alpine

WORKDIR /app
COPY server.mjs ./server.mjs


ENV NODE_ENV=production
ENV PORT=3000
# AUTH_TOKEN will be set via docker-compose or environment, not hardcoded here

EXPOSE 3000

CMD ["node", "server.mjs"]
