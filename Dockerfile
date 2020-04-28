FROM node:10
ENV PORT 3000
RUN mkdir -p /root/webpack-clean
WORKDIR /root/webpack-clean
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD npm test