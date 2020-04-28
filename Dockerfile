FROM node:10
RUN mkdir -p /root/webpack-clean
WORKDIR /root/webpack-clean
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
EXPOSE 8080
CMD npm test