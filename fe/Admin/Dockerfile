# Giai đoạn 1: build ứng dụng React/Vite
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Giai đoạn 2: chạy Nginx để phục vụ file build
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


