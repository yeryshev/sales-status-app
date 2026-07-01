#!/bin/sh

FILE_NAME="${LEGO_CERT_DOMAIN#\*.}"

cp -f "$LEGO_CERT_PATH" /app/certificates/"$FILE_NAME".crt
cp -f "$LEGO_CERT_KEY_PATH" /app/certificates/"$FILE_NAME".key

# Create symlinks for all VIRTUAL_HOST domains from the same domain zone
cd /app/certificates

# Extract the base domain (e.g., "sales.selectel.org" from "staging.status.sales.selectel.org")
BASE_DOMAIN=$(echo "$FILE_NAME" | rev | cut -d. -f1-3 | rev)

# Get all VIRTUAL_HOST values from running containers
VIRTUAL_HOSTS=$(for container in $(curl -s --unix-socket /var/run/docker.sock http://localhost/containers/json | grep -o '"Id":"[^"]*"' | cut -d'"' -f4); do 
  curl -s --unix-socket /var/run/docker.sock http://localhost/containers/$container/json | grep -o '"VIRTUAL_HOST=[^"]*"' | head -1 | cut -d= -f2 | tr -d '"'
done | tr ',' '\n' | sort -u)

# Create symlinks for domains from the same base domain
for DOMAIN in $VIRTUAL_HOSTS; do
  # Check if domain ends with the same base domain and is not the main cert file
  if echo "$DOMAIN" | grep -q "$BASE_DOMAIN$" && [ "$DOMAIN" != "$FILE_NAME" ] && [ -n "$DOMAIN" ]; then
    ln -sf "$FILE_NAME".crt "$DOMAIN".crt
    ln -sf "$FILE_NAME".key "$DOMAIN".key
    echo "Created symlink: $DOMAIN -> $FILE_NAME"
  fi
done

curl --unix-socket /var/run/docker.sock -X POST http://localhost/containers/nginx-proxy/restart
