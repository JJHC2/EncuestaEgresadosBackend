# Encuesta de Egresados - UTVT

Este proyecto es una **encuesta de egresados** diseñada para la **Universidad Tecnológica Valle del Valle de Toluca (UTVT)**, con el objetivo de analizar y entender las razones por las cuales los estudiantes no logran insertarse en el mercado laboral tras graduarse. Está desarrollado utilizando **Node.js** para el backend y **React** para el frontend.

## Tecnologías Utilizadas

- **Backend**: Node.js  
- **Frontend**: React.js  
- **Base de datos**: PostgreSQL  
- **Control de versiones**: Git y GitHub  

## Dependencias Principales

### Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas:  

- [Node.js](https://nodejs.org/)  
- [npm](https://www.npmjs.com/)  
- [Git](https://git-scm.com/)  
- [PostgreSQL](https://www.postgresql.org/)  
- Editor de código como [Visual Studio Code](https://code.visualstudio.com/)  

### Dependencias del Backend

Las siguientes dependencias se utilizan en el backend del proyecto:  

- `express` - Framework para crear el servidor.  
- `pg` - Cliente de PostgreSQL para Node.js.  
- `sequelize` - ORM para interactuar con PostgreSQL.  
- `dotenv` - Para manejar variables de entorno.  
- `body-parser` - Middleware para manejar solicitudes HTTP.  
- `cors` - Middleware para habilitar CORS en el servidor.  

## Configuración del Entorno de Desarrollo

### 1. Clonar el Repositorio

Utiliza el siguiente comando para clonar el repositorio en tu máquina local:  

`bash`
git clone https://github.com/JJHC2/EncuestaEgresadosBackend.git

2. Acceder al Proyecto
Accede a la carpeta generada utilizando la terminal o un terminal como PowerShell o el símbolo del sistema:

`bash`
cd <ruta/donde/se/almacenó/la/carpeta>
Por ejemplo, si la carpeta está en el escritorio:

`bash`
cd ~/Desktop/EncuestaEgresadosBackend
3. Instalar Dependencias
Ejecuta el siguiente comando para instalar todas las dependencias necesarias:

`bash`
npm install
Después, instala la dependencia de desarrollo nodemon de manera global:

`bash`
npm install -g nodemon
4. Configurar Variables de Entorno
Crea un archivo .env en la raíz del proyecto con el siguiente contenido, configurando los valores según tu entorno:

`env`
PORT=5000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_de_la_base_de_datos
DB_PORT=5432
5. Iniciar el Proyecto
Abre el proyecto en tu editor de código. Si usas Visual Studio Code, puedes abrirlo con el comando:

`bash`
code .
Para iniciar el servidor, ejecuta el siguiente comando en la terminal:

`bash`
nodemon index
Si todo está configurado correctamente, deberías ver un mensaje como el siguiente:

Ejecutando en el puerto 5000
### Notas Adicionales
La base de datos PostgreSQL debe estar configurada y en ejecución antes de iniciar el servidor.
Si necesitas inicializar las tablas de la base de datos, verifica que sequelize esté configurado correctamente en tu proyecto.
### Contacto
Si tienes dudas o sugerencias, por favor contacta al desarrollador principal en: al222110834@gmail.com
