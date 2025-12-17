#!/bin/sh
set -e

# Remove the uploads directory if it exists and is empty
# (it was created during build but we want to symlink to the volume)
if [ -d "/app/public/uploads" ] && [ ! -L "/app/public/uploads" ]; then
    rm -rf /app/public/uploads
fi

# Create symlink from volume mount to public/uploads
# The volume will be mounted at /uploads by Coolify
if [ ! -e "/app/public/uploads" ]; then
    ln -s /uploads /app/public/uploads
    echo "✓ Created symlink: /app/public/uploads -> /uploads"
fi

# Execute the main command
exec "$@"
