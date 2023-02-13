FROM node:16-alpine 
#The above specifies the base image to be the official Node.js Alpine Linux image.

WORKDIR /app
#The WORKDIR instruction sets the working directory to /app. This directory will be created if it doesn't exist.

RUN apk update && apk add --no-cache nmap && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
    chromium \
    harfbuzz \
    "freetype>2.8" \
    ttf-freefont \
    nss

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY . /app

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]