SOLO DESPUES DE CLONAR EL REPOSITORIO Y QUERER ARRANCAR LA APP:
Requisitos para iniciar la aplicacion:
Nodejs: Version 22.19.0
npm: 10.9.3
Ambos agregados a las variables de entorno. 
Para iniciar la app, abrir una terminal en el mismo directorio que package.json, por lo que tenga al final:
.../backend/api
y alli ejecutar:
1. npm install
2. npm run cloned
el servidor arranca por defecto en: http://127.0.0.1:3000

nodemon:nodemon es una herramienta que ayuda a desarrollar aplicaciones basadas en Node.js reiniciando automáticamente la aplicación de nodo cuando se detectan cambios de archivos en el directorio.
para modo desarrollo ya esta disponible nodemon!
solo usa 'npm run dev' en la ubicacion del package.json