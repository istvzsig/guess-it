#!/bin/bash

# Variables
APP_NAME="guess-it"                          # Name of your application
ANGULAR_APP_PATH="./"                        # Path to your Angular application (current directory)
DIST_PATH="$ANGULAR_APP_PATH/dist/$APP_NAME" # Path to the built Angular app
NGINX_ROOT="/usr/share/nginx/html"           # Default Nginx root directory

# Build the Angular application
echo "Building Angular application..."
cd $ANGULAR_APP_PATH || {
    echo "Failed to change directory to $ANGULAR_APP_PATH"
    exit 1
}
npx nx build .

# Create the directory for the application in Nginx root
echo "Creating directory for the application in Nginx root..."
sudo mkdir -p $NGINX_ROOT/$APP_NAME/

# Copy built files to Nginx root under the specific app directory
echo "Copying files to Nginx root..."
sudo cp -r $DIST_PATH/* $NGINX_ROOT/$APP_NAME/

# Create or update Nginx configuration for the application
echo "Creating/updating Nginx configuration..."
sudo tee /opt/homebrew/etc/nginx/servers/$APP_NAME.conf >/dev/null <<EOL
server {
    listen 5555;  # Change to 80 if you want to use the default HTTP port
    server_name localhost;  # Use localhost for local development

    location /$APP_NAME/ {
        alias $NGINX_ROOT/$APP_NAME/;  # Serve files from the specific app directory
        try_files \$uri \$uri/ /$APP_NAME/index.html;  # Fallback to index.html for SPA routing
    }
}
EOL

# Restart Nginx
echo "Restarting Nginx..."
sudo brew services restart nginx

echo "Setup complete! Access your Angular app at http://localhost:5555/$APP_NAME/"
