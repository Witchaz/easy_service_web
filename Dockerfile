FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install

COPY . .
# COPY public public
RUN bun run build

CMD ["bun", "run", "start"]

EXPOSE 3000
