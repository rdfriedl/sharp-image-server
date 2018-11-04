FROM node:latest
ENV NODE_ENV="production"
ENV CACHE_DIR="/cache"
ENV IMAGE_DIR="/images"
ENV PORT="80"

VOLUME /cache
VOLUME /images

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY server server
COPY index.js ./

EXPOSE 80

CMD [ "npm", "start" ]
