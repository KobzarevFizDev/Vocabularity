## О проекте

Данный проект является mcp сервером для управления vocabularity.backend проектом

## Endpoints

- suggest_vocabulary_candidates, Endpoint предлагает список слов для изучения пользователю. Пользователь может либо добавить эти слова в свой словарь либо удалить их. Endpoint принимает слова без id. Слова отправляются через Action
- clear_vocabulary_candidates, Endpoint удаляет все слова предложенные пользователю

## Для разработки

- Запускать сервер: python main.py
- Либо: fastmcp run main.py:mcp --transport http --port 9000
- Запускать инспектор: npx @modelcontextprotocol/inspector
