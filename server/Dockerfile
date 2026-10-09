# Base stage for every other stage
FROM node:22-slim AS base
RUN corepack enable pnpm
WORKDIR /app

# Get dependencies stage
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage for dev mode image
FROM deps AS dev
RUN pnpm add nodemon -D
COPY . .
EXPOSE 3000
CMD ["pnpm", "start:dev"]

FROM deps AS build
COPY . .
#genere les dossier dist/ necessaire pour lancer en prod
RUN pnpm build 

#Stage for prod mode image
FROM base AS prod
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --chown=node:node --from=build /app/dist ./dist
USER node
EXPOSE 3000
CMD ["pnpm", "start:prod"]