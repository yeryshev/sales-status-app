#!/bin/sh
chmod +x /app/deploy
exec tini -e 143 -- /app/setup "$@"

