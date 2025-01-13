##========== COLORS ==========##

BASE_COLOR		=	\033[0;39m
BLACK			=	\033[30m
GRAY			=	\033[0;90m
DARK_GRAY		=	\033[37m
RED				=	\033[0;91m
DARK_GREEN		=	\033[32m
DARK_RED		=	\033[31m
GREEN			=	\033[0;92m
ORANGE			=	\033[0;93m
DARK_YELLOW		=	\033[33m
BLUE			=	\033[0;94m
DARK_BLUE		=	\033[34m
MAGENTA			=	\033[0;95m
DARK_MAGENTA	=	\033[35m
CYAN			=	\033[0;96m
WHITE			=	\033[0;97m
BLACK_ORANGE	=	\033[38;2;187;62;3m

help:
	@ clear
	@ echo "$(ORANGE)┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[ HELP ]━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"
	@ echo 			"┃ - $(BLUE)help:$(CYAN) Show command list.						$(ORANGE)┃"
	@ echo 			"┃ - $(BLUE)up: $(CYAN)Build and start services.					$(ORANGE)┃"
	@ echo 			"┃ - $(BLUE)down: $(CYAN)End services.							$(ORANGE)┃"
	@ echo 			"┃ - $(BLUE)re: $(CYAN)End and restart services.					$(ORANGE)┃"
	@ echo 			"┃ - $(BLUE)logs: $(CYAN)Create logfiles with docker logs.				$(ORANGE)┃"
	@ echo 			"┃ - $(BLUE)rm_logs: $(CYAN)Delete the logs files.					$(ORANGE)┃"
	@ echo 			"┃ - $(BLUE)clean: $(CYAN)Clean all.							$(ORANGE)┃"
	@ echo 			"┃ - $(BLUE)fre: $(CYAN)Clean and re up all.						$(ORANGE)┃"
	@ echo "$(ORANGE)┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"


up:
	@ clear
	@ echo "$(DARK_GREEN)Creating Mandatory!$(BASE_COLOR)"
	@ echo "$(RED)Building project...$(BASE_COLOR)"
	@ docker compose -f ./srcs/docker-compose.yml --progress quiet build
	@ echo "$(DARK_GREEN)Build done !$(BASE_COLOR)"
	@ echo "$(RED)Starting services...$(BASE_COLOR)"
	@ docker compose -f ./srcs/docker-compose.yml --progress quiet up -d
	@ echo "$(DARK_GREEN)Services started !$(BASE_COLOR)"

down: rm_logs
	@ clear
	@ echo "$(RED)Ending services...$(BASE_COLOR)"
	@ docker compose -f ./srcs/docker-compose.yml --progress quiet down
	@ echo "$(DARK_GREEN)Services ended !$(BASE_COLOR)"

logs:
	@ echo "$(RED)Creating logs...$(BASE_COLOR)"
	@ docker logs mariadb > mariadb.log
	@ docker logs nginx > nginx.log
	@ docker logs wordpress > wordpress.log
	@ docker logs adminer > adminer.log		
	@ docker logs ftp > ftp.log
	@ docker logs portainer 2> portainer.log
	@ docker logs redis > redis.log 2>redis.log
	@ echo "$(DARK_GREEN)Logs created!$(BASE_COLOR)"

rm_logs:
	@ echo "$(RED)Deleting logs...$(BASE_COLOR)"
	@ rm -f adminer.log ftp.log portainer.log redis.log static_page.log mariadb.log nginx.log wordpress.log
	@ echo "$(GREEN)Logs deleted!$(BASE_COLOR)"

clean: down
	@ echo "$(RED)Removing files in .data...$(BASE_COLOR)"
	@ sudo rm -rf ~/.data/database/* ~/.data/web/* ~/.data/vsftpd/* ~/.data/log/vsftpd/*
	@ echo "$(RED)Removing all docker image...$(BASE_COLOR)"
	@ docker system prune -f >/dev/null
	@ if [ -n "$$(docker ps -qa)" ]; then \
		echo "$(RED)Stopping and removing running docker...$(BASE_COLOR)"; \
		docker stop $$(docker ps -qa) >/dev/null; \
		docker rm $$(docker ps -qa) >/dev/null; \
	fi
	@ if [ -n "$$(docker images -qa)" ]; then \
		echo "$(RED)Removing images...$(BASE_COLOR)"; \
		docker rmi -f $$(docker images -qa) >/dev/null; \
	fi
	@ if [ -n "$$(docker volume ls -q)" ]; then \
		echo "$(RED)Removing volumes...$(BASE_COLOR)"; \
		docker volume rm $$(docker volume ls -q) >/dev/null; \
	fi
	@ if [ -n "$$(docker network ls -q --filter "type=custom")" ]; then \
		echo "$(RED)Removing custom networks...$(BASE_COLOR)"; \
		docker network rm $$(docker network ls -q --filter "type=custom") 2>/dev/null; \
	fi
	@ echo "$(GREEN)All cleaned!$(BASE_COLOR)"

re:
	@ $(MAKE) down
	@ $(MAKE) up

fre: clean up

.PHONY:
	help up down logs rm_logs clean re