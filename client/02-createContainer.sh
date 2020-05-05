docker stop ui || true && docker rm ui || true
docker create --name ui --restart unless-stopped -p 8080:80 charpstar/ui
