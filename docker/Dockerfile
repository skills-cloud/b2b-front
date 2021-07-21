FROM node:14.13.1-alpine as frontend_prod_builder
ARG ENV_NAME=prod
WORKDIR /app
ADD /package.json /app/package.json
ADD /yarn.lock /app/yarn.lock
RUN yarn
ADD . /app/
RUN echo ${ENV_NAME}
RUN yarn build:${ENV_NAME}

FROM nginx:1.16-alpine
ADD ./docker/vhost.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend_prod_builder /app/build/ /app/
