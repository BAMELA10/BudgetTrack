FROM node:22-slim AS base
RUN corepack enable pnpm
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS dev
COPY . .
EXPOSE 4200
CMD ["pnpm", "start", "--host", "0.0.0.0", "--poll", "2000", "--watch"]

FROM deps AS build
COPY . .
RUN pnpm run build

FROM base AS prod
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --chown=node:node --from=build /app/dist ./dist
USER node
EXPOSE 4000
CMD ["node", "dist/client/server/server.mjs"]

