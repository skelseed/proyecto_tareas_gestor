# Gestor de Tareas

[Funcionalidades](#funcionalidades) | [Tecnologías](#tecnologías-utilizadas) | [Instrucciones](#cómo-usar) 

[Uso de la IA](https://github.com/skelseed/proyecto_tareas_gestor/blob/main/docs/uso_ia.md)

## Funcionalidades

- Crear tareas con nivel de prioridad (Alta, Media, Baja)
- Asignar tareas a tabla Kanban que incluye:
    - **Pendientes**
    - **En Proceso**
    - **Completadas**
- Mover tareas entre columnas mediante arrastrar y soltar
- Editar y eliminar tareas existentes
- Persistencia de datos usando localStorage

## Tecnologías utilizadas

- HTML5, CSS3 y JavaScript Vanilla
- Drag & Drop API nativa
- LocalStorage para guardar tareas

## Cómo usar

1. Clona o descarga este repositorio
2. Abre el archivo `index.html` en tu navegador
3. Agrega una nueva tarea con título, descripción y prioridad
4. Arrastra las tareas entre las columnas del Kanban

## Estructura del proyecto
```
proyecto_tareas_gestor/
├── index.html
├── README.md
├── assets/
│                 ├── css/
│                 │            ├── style.css
│                 │            └── responsive.css
│                 ├── js/
│                 │         └── script.js
│                 ├── img/
│                 │             ├── logo.png
│                 │             └── favicon.ico
│                 └── fonts/
└── docs/
    └── uso_ia.md
```