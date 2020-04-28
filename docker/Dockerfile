FROM node:10
ENV PORT 3000
RUN mkdir -p /usr/src/webpack-clean
WORKDIR /usr/src/webpack-clean
COPY package.json /usr/src/webpack-clean/
RUN npm install --silent
COPY . /usr/src/webpack-clean
EXPOSE 3000
CMD ["npm", "test"]