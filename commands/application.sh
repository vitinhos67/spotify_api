# to run this command only type in your terminal "bash run.sh"
# .env file with credentials is required

sudo docker compose -f ./Docker/docker-compose.yml \
    --env-file .env \
    up # Up server in docker 
