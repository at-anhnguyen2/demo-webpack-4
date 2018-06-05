# Running lastest node version
FROM node:latest

# Copy and install all dependencies of the current project
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

# Copy all local files into the image 
COPY . .

# Build for production
RUN npm run build

# Install and configure serve
# Default serve port: 5000
RUN npm install -g serve
CMD serve -s ./build

# Expose port 8080 for deverlopment env
EXPOSE 8080
