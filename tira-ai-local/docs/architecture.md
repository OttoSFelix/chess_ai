# Architecture

Websocket-based communications occur through App, using socket service. Chess, gomoku, connect4 and othello are subprocesses that run within a Game instance.

```mermaid
classDiagram
Electron Main --> Electron Renderer
Electron Main --> Background-service
Electron Renderer ..> Background-service: Websocket
Electron Renderer <.. SocketService: Websocket
Electron Renderer --> App
App --> MainView
MainView *-- Board
MainView *-- Logs
MainView *-- AIForm
Background-service *-- GameService
GameService *-- Game
GameService *-- SocketService
Game *-- Logger
Game *-- Chess
Game *-- AiDirectory
```
