FROM oven/bun:1.1.22
WORKDIR /backend
COPY . .
RUN bun i
RUN bun run build
# COPY .env.runtime release/.env.runtime

VOLUME [ "/backend" "/user_files", "db" ]
CMD ["./release/server"]
ENV APP_URL="0.0.0.0"

# docker build -f Production.Dockerfile -t backend . # --no-cache --progress=plain
# docker run -p 3000:3000 -v C:\Users\Vector\Desktop\AWS\vexio\frontend\release:/frontend/release -v user_files:/user_files -v db:/db backend
