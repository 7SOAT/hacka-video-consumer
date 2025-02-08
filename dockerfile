
FROM node:20-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY devops/installers/ffmpeg /usr/local/bin/ffmpeg
COPY devops/installers/ffprobe /usr/local/bin/ffprobe

RUN chmod +x /usr/local/bin/ffmpeg /usr/local/bin/ffprobe

ENV PATH="/usr/local/bin:$PATH"

EXPOSE 3000

CMD ["npm", "run", "start"]
