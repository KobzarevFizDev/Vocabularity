## О проекте

Это CRUD приложение, которое отвечает за управление карточками слов

## Команды

- uvicorn main:app --reload
- uvicorn main:app --reload --host 127.0.0.1 --port 8000
- python -m main

## Swagger

- Swagger доступен по адресу: http://localhost:8000/docs.
- openapi.json можно скачать тут: http://localhost:8000/openapi.json

## Миграции

- За сборку миграций отвечает build_migrator.ps1
- Для того чтобы собрать мигратор под Raspberry, используй команду .\build_migrator.ps1 -Target arm64 -Output arm64-migrator
- Для запуска на Raspberry pi укажи параметры: --dir (каталог с миграциями) --host, --port для БД

## Установка на Raspberry

- Собираем мигратор
- Упаковываем весь проект в zip архив и переносим архив на ноутбук
- scp Vocabularity.zip root@192.168.1.10:/root/apps/
