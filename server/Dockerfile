FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl netcat-openbsd

COPY package*.json ./

RUN npm install

COPY . ./

RUN chmod +x /app/entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["npm", "run", "dev"]
