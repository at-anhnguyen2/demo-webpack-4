FROM node:latest

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

COPY . .

RUN npm run build --production

CMD ./node_modules/.bin/serve -s build

EXPOSE 8080
