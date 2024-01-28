FROM node:20.10-alpine as build-step

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml /app/

RUN pnpm install

COPY . /app

RUN cp src/environment.prod.ts src/environment.ts

RUN pnpm build:prod

FROM nginx:alpine

COPY --from=build-step /app/dist/web/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
