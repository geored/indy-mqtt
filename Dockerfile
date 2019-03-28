FROM node:8

WORKDIR /opt/app

COPY package.json .
COPY index.js .
COPY serviceaccount.json .

RUN npm install

CMD node index.js