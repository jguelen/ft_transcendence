DC = docker compose

all: up

up: secrets/nginx.key secrets/nginx.crt
	$(DC) up --build -d

secrets/nginx.key secrets/nginx.crt:
	mkdir -p secrets
	openssl req -x509 -nodes -days 365 -newkey rsa:4096 -subj "/C=/ST=/L=/O=/CN=localhost" -keyout secrets/nginx.key -out secrets/nginx.crt

down:
	$(DC) down

logs:
	$(DC) logs -f

clean:
	$(DC) down --rmi all

fclean: clean
	docker compose down -v
	docker system prune -a -f

re: clean all

.PHONY: all up down clean re logs
