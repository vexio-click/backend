FROM oven/bun:1.1.22
WORKDIR /backend
COPY . .
RUN bun i
# COPY .env.runtime release/.env.runtime

VOLUME [ "/backend" "/user_files", "db" ]
ENV APP_URL="0.0.0.0"

CMD ["bun","run", "start"]
# docker build -f Production.Dockerfile -t backend . # --no-cache --progress=plain
# docker run -p 3000:3000 -v C:\Users\Vector\Desktop\vexio\frontend\release:/frontend/release -v user_files:/user_files -v db:/db backend
