# Calidad Competitiva — refinamiento visual

## Abrir la página

1. Extrae todo el ZIP.
2. Abre `Calidad_Competitiva/index.html` en tu navegador.
3. Para editar, abre la carpeta completa en Visual Studio Code. Live Server es opcional.

No necesitas instalar paquetes, configurar cuentas ni conectarte a internet para ver las páginas, las imágenes, la búsqueda o las 150 respuestas predeterminadas del asistente.

## Qué incluye

- Las 10 páginas y el orden de secciones de la versión HTML original.
- Logotipo, colores azul marino y dorado, textos, fotografías del equipo y catálogo conservados.
- Seis fondos nuevos generados para inicio, nosotros, servicios, productos, equipo y contacto, optimizados en WebP e incluidos en el proyecto.
- Títulos HTML nítidos sobre los fondos, sin menús ni textos incrustados en las imágenes.
- Tarjetas y botones refinados, sombras suaves, espaciado uniforme y transiciones discretas.
- Adaptación para móvil y tableta y respeto por la preferencia del sistema de reducir animaciones.
- Menú desplegable, búsqueda, asistente local y formulario de contacto.

Las fotografías generadas son ilustrativas; no sustituyen las fotografías personales originales del equipo ni las imágenes de productos concretos.

## Contacto

El formulario prepara un mensaje en la aplicación de correo configurada en el equipo. No realiza envíos automáticos ni necesita servidor. Las consultas desde productos incluyen el nombre seleccionado.

## Editar

- Contenido: archivos `.html`.
- Estilos originales: `assets/css/styles.css`.
- Mejoras visuales: `assets/css/refinamiento.css`.
- Interacciones: `assets/js/main.js` y `assets/js/refinamiento.js`.
- Respuestas del asistente: `assets/js/faq-data.js` (archivo usado por el navegador).
- Imágenes nuevas: `assets/img/generadas/`.

## Verificación

Se comprobaron las rutas locales de las 10 páginas, la integridad de las imágenes, la sintaxis JavaScript y la conservación del orden de títulos original. Se revisaron visualmente escritorio, móvil de 390 px y tableta de 768 px, y se probaron navegación desplegable, búsqueda y una respuesta del asistente.

## Mejoras de navegación y consultas

- Búsqueda por nombre o característica en cada catálogo, sin depender de tildes o mayúsculas.
- Orden original, nombre A–Z y menor precio. Los artículos sin precio publicado quedan al final al ordenar por precio.
- Vista ampliada de las imágenes de productos, con cierre mediante botón o Escape.
- Lista de consulta compartida entre productos y servicios; permite añadir, quitar y vaciar la selección.
- La selección se guarda en este navegador cuando el almacenamiento local está disponible. No incluye datos personales del formulario.
- “Preparar consulta” lleva la selección al mensaje de contacto. También funciona sin almacenamiento al trasladar los identificadores en el enlace.
- Botón para copiar el mensaje completo; si el portapapeles no está disponible, muestra el texto seleccionable.
- Ruta de navegación, botón para volver arriba y controles adaptados a pantallas pequeñas.

Los nuevos estilos están en `assets/css/experiencia.css`; las interacciones en `assets/js/experiencia.js`. El índice `assets/js/catalogo-data.js` corresponde a los productos y servicios del HTML: al editar nombres, imágenes o precios, actualiza también su entrada en este índice. Los identificadores `data-item` deben mantenerse estables.

Validación adicional: búsqueda sin tildes, orden por precio, resultado vacío y restablecimiento; ampliación y cierre con Escape; selección entre páginas, retirada y vaciado; traslado de un producto y un servicio al formulario; copia del mensaje; ajuste móvil de 360 px sin desbordamiento horizontal. Se comprobó la sintaxis de los scripts y la existencia de sus recursos locales. El envío de correo se mantiene bajo control del usuario.
