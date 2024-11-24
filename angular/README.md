![Nombre_proyecto](https://bitbucket-assetroot.s3.amazonaws.com/c/photos/2021/Sep/21/2037733242-8-documentacion-proyectos-logo_avatar.png)

## Nombre del proyecto - ejemplo Proyecto de Test

Agregar descripcion del proyecto.


### Agregar area de proyecto 


### Documentación API y ejemplos

## Tabla de Contenido
1. [Comenzando](#markdown-header-comenzando)
2. [Instalación](#markdown-header-instalacion)
3. [Puesta en marcha](#markdown-header-puesta-en-marcha-a-namepuesta-en-marchaa)
4. [Documentación](#markdown-header-documentacion)
5. [Ramas](#markdown-header-ramas)
6. [Otros](#markdown-header-otros)
7. [Herramientas](#markdown-header-herramientas)
7. [Licencia](#markdown-header-licencia)

## Comenzando 🚀
- Agregar instrucciones del proyecto

## Instalación 🔧
  Clonar el proyecto desde el repositorio `https://bitbucket.org/APPYWEB/fisicalcoach-angular/`, para despliegue en ambiente de desarrollo y/o testing clonar la branch develop y en ambiente de produccion la branch master.

## Puesta en marcha 🔩

- yarn install -> add modules 
- yarn run extract -> extract labels automatical translater

- Crear un archivo con el nombre de .env en el directorio `angular` con las siguientes variables y rellenar los valores de acuerdo a la configuración
    ```bash
    API_URL=
    GOOGLE_OAUTH_API_KEY=
    images=
    resourcesIframe=
    ```
## Documentación 📖

    
    Para la translater
    - Agregar la libreria 

        TranslateModule.forRoot( {
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpClient ]
      }
    } );

    en el module.ts del modulo en donde se quiere implementar y agregar el export en el mismo module.ts

    export function HttpLoaderFactory( http: HttpClient ) {
        return new TranslateHttpLoader( http );
    }

    Para implementarlo en los components, debe agregarlo en el constructor el pipe translate listo ya lo pude usar
    

## Ramas 🧬
    - master: código para el ambiente de producción.
    - develop: código para el ambiente de desarrollo/testing.

## Otros 📚
- Agregar otro datos que se considere necesario en el proyecto

## Herramientas 
* Angular

## Licencia 📄

Este proyecto está bajo licencia privada, cualquier uso sin su consentimiento queda prohibido.


![Fisicalcoach](https://img.shields.io/badge/Appyweb-Fisicalcoach-blue)

> **Nota**: El archivo README.md está escrito en 'Markdown', mas información en [Markdown](https://markdown.es/sintaxis-markdown)


