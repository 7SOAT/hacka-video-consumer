FROM node:20-slim

RUN apt update && apt install -y ffmpeg

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
