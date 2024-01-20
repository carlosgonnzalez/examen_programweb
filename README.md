
# Ahorcado Finísimo

## Descripción
Ahorcado Finísimo es un juego de ahorcado en línea desarrollado utilizando tecnologías web como Node.js, Express, y Socket.IO. Este proyecto permite a los jugadores crear y unirse a salas de juego para jugar al ahorcado con palabras generadas aleatoriamente o a través de una API externa.

## Características
- Creación y unión a salas de juego.
- Interfaz gráfica para adivinar palabras y visualizar el progreso del juego.
- Comunicación en tiempo real entre jugadores mediante Socket.IO.
- Generación de palabras aleatorias tanto localmente como a través de una API externa.

## Instalación
Para instalar y ejecutar Ahorcado Finísimo en tu entorno local, sigue estos pasos:

1. Clona el repositorio:
   ```
   git clone https://github.com/carlosgonnzalez/examen_programweb
   ```
2. Navega hasta el directorio del proyecto y ubicate en la carpeta [frontend],
   abre un terminal integrado de esa carpeta e instala las dependencias:
   ```
   npm install
   ```
4. Navega hasta el directorio del proyecto y ubicate en la carpeta [Server],
   abre un terminal integrado de esa carpeta e instala las dependencias:
   ```
   npm install
   ```
5. Ya con las dependencias intaladas en la carpeta [frontend] y en [Server]
   debes iniciar este comando en los terminales integrados de las dos carpetas:
   ```
   npm run dev
   ```
7. Abre tu navegador y navega a `http://localhost:5173` para empezar a jugar.

## Uso
Una vez que el servidor esté corriendo y la página esté abierta en un navegador:
- Ingresa tu nombre para comenzar.
- Crea una nueva sala o únete a una existente utilizando su ID.
- Una vez en la sala, puedes comenzar a adivinar letras para descubrir la palabra oculta.

## Contribuir
Si deseas contribuir a Ahorcado Finísimo, por favor sigue estos pasos:

1. Haz un "fork" del repositorio.
2. Crea una rama para tus cambios (`git checkout -b mi-nueva-caracteristica`).
3. Realiza tus cambios y haz commit de ellos (`git commit -am 'Añadir alguna característica'`).
4. Empuja a la rama (`git push origin mi-nueva-caracteristica`).
5. Crea un nuevo Pull Request.

## Contacto
Si tienes preguntas o comentarios sobre este proyecto, por favor contáctanos a [cegonzalez.21@est.ucab.edu.ve].
