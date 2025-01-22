FROM postgres:latest

RUN apt-get update && apt-get install -y bc

COPY pgbench-script.sh /usr/local/bin/pgbench-script.sh
RUN chmod +x /usr/local/bin/pgbench-script.sh

CMD ["/usr/local/bin/pgbench-script.sh"]
