# winnie

A sassy, opinionated CSS Framework for WIN.

&rarr; [winnie](http://hspencer.github.io/winnie/docs)
&rarr; [Maquetas](http://hspencer.github.io/winnie/mockups)

### Features

* Vertical Rhythm
* Consistent pattern for form fields
* 8kb minified
* Smart defaults for all default elements (Conventional)
* CSS specificity is very low in the class hierarchy (Configurable)
* Solid foundation for a living styleguide using KSS

## Installation

To use the CSS as is, you can install using npm or bower:

```
npm install winnie
```

```
bower install winnie
```

If you want to create your own styleguide, fork the repository and modify the `src` and `kss-html` folders.


### Development

After cloning, you'll first need to install dependencies by running `npm run setup`.

After that just run `npm start`.

KSS will generate the docs from the `kss-html` folder. The `dist` folder is created from  the `src` folder.

### Contributors

Contributors are welcome, just follow these few guidelines:

* Avoid checking in compiled files (dist and docs folders) as this will reduce merge conflicts with master
* BEM for naming conventions
* Alphabetical properties
* Only nest for pseudo-elements

### Compile templates using [nunjucks](https://mozilla.github.io/nunjucks/)

Folder structure:
```
winnie
└── mockups
    ├── index.html
    ├── all.html
    ├── js
    │   └── all-scripts.js
    └── templates
       └── partials
```
`/templates` define HTMLs DOM structure while `/partials` define HTML code snipets to use as modules.


## Instrucciones para el Desarrollo Local

Algunos requisitos básicos para ordenar el entorno de trabajo:

1. Servidor web localhost
2. [NodeJS](https://nodejs.org/es/)

En Mac, se recomienda utilizar [homebrew](http://brew.sh) para instalar todos los paquetes necesarios.

### Criterios de nombres para las clases en SASS

* Utilizar nombres en **inglés** para todas las clases utilizando convensiones:
* **Parent-child** relationships (ie: `.post > .post-title`) 
* **Plural Parent Pattern** (ie. `.tabs` para contenedores de muchos hijos en vez de `.tab` como clase hija-genérica) 
* Uso de modificadores en combinación con las clases definidas. Los modificadores van en `/utilities.scss`

[Ver artículo de referencia](http://thesassway.com/advanced/modular-css-naming-conventions)
 


