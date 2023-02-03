all :
	docker-compose up --build

fclean :
	docker-compose down
	docker container prune --force 
	docker image prune --force --all
	docker network prune --force 
	docker volume prune --force 

re : fclean all

frontend :
	docker restart front

backend :
	docker restart backend

nginx : 
	docker restart nginx

down :
	docker-compose down

.PHONY: all fclean re frontend backend nginx
