FROM alpine:latest

RUN apk add --no-cache fio bash

COPY base.fio /usr/local/etc/base.fio
COPY fio.sh /usr/local/bin/fio.sh
COPY .env /usr/local/bin/.env

WORKDIR /usr/local/bin

RUN chmod +x fio.sh

CMD ["bash", "fio.sh"]
