FROM mongo

# Workdir configs directory
WORKDIR /usr/src/configs

# Copy config files
COPY mongo.conf .

EXPOSE "${DB_PORT:-27017}"

CMD ["--config", "./mongo.conf"]