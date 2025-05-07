# Use the official Nginx base image
FROM nginx:alpine

COPY front/browser/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
