docker stop ui || true && docker rm ui || true
docker create --name ui --restart unless-stopped -p 80:80 charpstar/ui