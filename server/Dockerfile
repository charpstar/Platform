FROM node:14-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN apk --no-cache add --virtual builds-deps build-base python
COPY package.json /app/package.json
RUN npm install
COPY . /app
EXPOSE 8081
EXPOSE 5432
CMD ["node", "--es-module-specifier-resolution=node", "src/app.js"]
