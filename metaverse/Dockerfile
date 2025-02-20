# Base Stage
FROM node:18-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@latest

# Install Dependencies Stage
FROM base AS dependencies
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

# Build Stage (for frontend)
FROM dependencies AS build
COPY . .
RUN pnpm run build # Builds all packages including frontend

# Runtime Stage for Services (ws, http)
FROM base AS runtime
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/ws ./apps/ws
COPY --from=build /app/apps/http ./apps/http
COPY --from=build /app/apps/pixi-experience ./apps/pixi-experience

CMD ["pnpm","run", "dev"] # Change to "start" for production
