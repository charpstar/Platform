FROM node:14-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN apk --no-cache add --virtual builds-deps build-base python
COPY . /app
RUN npm install 
EXPOSE 8081
EXPOSE 5432
CMD ["npm", "start"]