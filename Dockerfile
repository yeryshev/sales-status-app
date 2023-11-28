FROM node:18-alpine3.17 as build

WORKDIR /app
COPY . /app

RUN yarn
RUN yarn build

FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /var/www/html/
EXPOSE 5173
CMD ["nginx","-g","daemon off;"]
