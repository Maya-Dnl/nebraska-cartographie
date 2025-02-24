# NebraskaCartographie

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Deploy Staging

firebase logout 
firebase login -> select the appropriate google account for deploy in stage

  "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.staging.ts"
                }
              ]

ng build --configuration=development
firebase deploy --only hosting:staging --project nebraska-cartographie   (with dev account)

## Deploy production

firebase logout 
firebase login -> select the appropriate google account for deploy in production

  "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.ts"
                }
              ]

ng build --configuration=production
firebase deploy --only hosting:production --project carto-nebraska    (with prod account)  

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npx cypress open` for launch cypress

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

