# Development
# if you are using WSL2/Hyper-v (windows host) hot-reload will work only from container-internal editor, or like vs-code WSL editort
# this issue is because file system events are not shared between windows and linux inside WSL/Hyper-v!
# Docker supports WSL and Hyper-v (there is selection on install screen)
# Podman only WSL
# you can config usePolling vite option to update files without events by timer or linux-connected vs-code] or just run Podman/Docker under linux or WSL-connected editor like WSL vscode

FROM oven/bun:1.1.22
WORKDIR /backend
ENV APP_URL="0.0.0.0"
VOLUME [ "/backend", "/backend/node_modules", "/frontend/release" ]
EXPOSE 3000
CMD bun i; bun run dev

# docker build -f Development.Dockerfile -t dev-backend .
# docker run -p 3000:3000 -v C:\Users\Vector\Desktop\vexio\backend:/backend -v C:\Users\Vector\Desktop\vexio\frontend\release:/frontend/release dev-backend