FROM node:8

WORKDIR /opt/app

COPY package.json .
COPY index.js .
COPY serviceaccountkey.json .

RUN npm install

CMD node index.js