FROM node:12

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY .npmrc ./

RUN yarn install --frozen-lockfile --production && yarn cache clean

COPY build ./build
COPY dist_client ./dist_client
COPY dist_server ./dist_server

EXPOSE 3030

CMD ["yarn", "serve"]
