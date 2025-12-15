FROM node:20

WORKDIR /app

COPY package*.json .

RUN npm install

COPY public ./public
COPY src ./src

EXPOSE 5173

CMD ["npm", "dev"]
