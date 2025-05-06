# Use the official Nginx base image
FROM nginx:alpine

COPY front/e-commerce/browser/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
