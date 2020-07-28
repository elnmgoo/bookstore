# Bookstore

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.11.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Steps to setup this project

1. Install angular 9 (angular 10 had some issues with ngrx store)
npm install -g @angular/cli@9
2. Install ngrx/store
npm install @ngrx/store --save
npm install @ngrx/effects --save
npm install @ngrx/router-store --save
npm install --save ngx-mask 
3. Install bootstrap
npm install bootstrap
npm install popper --save
npm install jquery
4. Add bootstrap styles/scripts to angular.json

    ...
    "styles": [
       "src/styles.css",
       "node_modules/bootstrap/dist/css/bootstrap.min.css"
    ],
    "scripts": [
       "node_modules/jquery/dist/jquery.min.js",
       "node_modules/popper.js/dist/umd/popper.min.js",
       "node_modules/bootstrap/dist/js/bootstrap.min.js"
    ]
    ...
5. Add code to enable bootstrap tooltips
   ...
       $('body').tooltip({
         selector: '[data-toggle="tooltip"], [title]:not([data-toggle="popover"])',
         trigger: 'hover',
         container: 'body'
       }).on('click mousedown mouseup', '[data-toggle="tooltip"], [title]:not([data-toggle="popover"])',function() {
         $('[data-toggle="tooltip"], [title]:not([data-toggle="popover"])').tooltip('dispose');
       });
   ...    
6. Add proxy configuration to prevent cors problems
   Add /src/proxy.conf.json with reference to the backend server
   Add the /src/proxy.json.conf reference in angular.json
