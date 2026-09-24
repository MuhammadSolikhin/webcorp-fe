
# Stage 1: Build
FROM node:20.16.0-alpine AS build
WORKDIR /usr/src/nuxt-app

# FIX: Increase Node.js memory to prevent OOM
ENV NODE_OPTIONS="--max-old-space-size=8192 --max-semi-space-size=128"

# Install git for dependency cloning if necessary and update packages
RUN apk update && apk upgrade && apk add git

# Copy package.json and package-lock.json separately
COPY package*.json ./

# Install dependencies
RUN npm install --production=false

# Copy source code and install dependencies
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runtime
FROM node:20.16.0-alpine AS runtime
WORKDIR /usr/src/nuxt-app

# Copy only the built files and necessary packages from the build stage
COPY --from=build /usr/src/nuxt-app/.output ./.output
COPY --from=build /usr/src/nuxt-app/node_modules ./node_modules
COPY --from=build /usr/src/nuxt-app/package.json ./

# Expose environment variables
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
