FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN chmod +x /app/entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["npm", "run", "dev"]
