DC = docker compose

all: up

up:
	$(DC) up --build -d

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
