# Stage 1: Build the application
FROM node:20 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the application using Apache HTTPD
FROM httpd:alpine

COPY --from=builder /app/dist /usr/local/apache2/htdocs/

# Update the Apache configuration to listen on port 8080 as cloud run expects the container to listen on port 8080
RUN sed -i 's/Listen 80/Listen 8080/' /usr/local/apache2/conf/httpd.conf

# Set ServerName to suppress the warning
RUN echo "ServerName localhost" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 8080

CMD ["httpd-foreground"]