FROM node:10
RUN mkdir -p webpack-clean
WORKDIR /webpack-clean
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
EXPOSE 8080
CMD yarn test