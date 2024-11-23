Para desplegar el backend(lado del servidor) se necesita hacer lo siguiente 
1.-Clonar el repositorio utilizando el comando git clone https://github.com/JJHC2/EncuestaEgresadosBackend.git
Esto coopeara el proyecto en la carpeta seleccionada 
2.-Ingresar a la carpeta generada utilizar un powerSheel o simbolo de sistema segun sea el caso (terminal)
cd + ruta donde se almaceno la carpeta generada
una vez adentro de la carpeta colocar el comando 
npm i esto empezara a descargar por completo dependencias que necesita el proyecto
Despues intslar la dependencia de desarrollo nodemon utilizando el comando
npm install -g nodemon
3.-Una vez terminado el proceso acceder al proyecto igualmente en la terminal colocando code .
esto abrira una pestaña de visual studio code o el editor de codigo intalado en el sistema 
Para verificar que el proyecto esta instalado correctamente coloracr el comando ejecuta 
nodemon index y debera salirte el mensaje 
"ejecutando en el puerto y puerto(ya que puede cambiar el puerto)"
ejemplo de mensaje (No aplica en todos los casos)
"Ejecutando en el puerto 5000"
