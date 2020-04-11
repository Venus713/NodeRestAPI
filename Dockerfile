FROM node:11.15.0

EXPOSE 3000 9229

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm install -g nodemon
RUN npm install -g forever
RUN npm install -g jest
RUN npm install --production -f

COPY . /app

RUN chmod 777 /usr/local/bin/docker-entrypoint.sh \
    && ln -s /usr/local/bin/docker-entrypoint.sh /

RUN chmod +x /app/scripts/wait-for-postgres.sh

CMD ["npm", "run", "prod"]
