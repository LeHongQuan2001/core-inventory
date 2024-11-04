FROM node:16-alpine

WORKDIR /app
# Copy application files
COPY ./backend/package.json /app/backend/package.json

RUN apk --no-cache add tzdata

RUN cd /app/backend && npm install

COPY . .
RUN cd /app/backend &&  npm run start-gendoc

ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY ./backend/cronjobs/crontab.txt /var/spool/cron/crontabs/root

EXPOSE 4000
WORKDIR /app/backend
CMD crond && npm run start
