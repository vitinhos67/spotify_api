sudo docker compose -f ./Docker/mongo_db_test.docker.yml \
  --env-file .env \
  up -d