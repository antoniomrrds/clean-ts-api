FROM node:18.8.0
WORKDIR /usr/app/clean-architecture-api
COPY ./package*.json .
RUN npm install --only=dev

