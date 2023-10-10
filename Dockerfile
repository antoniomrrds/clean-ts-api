FROM node:18.8
WORKDIR /usr/app/clean-architecture-api
COPY package*.json ./
RUN npm install --only=production
COPY ./dist ./dist
EXPOSE 5000
CMD npm start
