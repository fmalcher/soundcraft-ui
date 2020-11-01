# soundcraft-ui testbed

This application is a test frontend for the `soundcraft-ui-connection` library.
All features of the library should also be present in this application so that the library and mixer connection can be proved working.

## Start the application

```
nx serve testbed
# OR
npm run testbed
```

## Development

To create new code artifacts, please use the provided code generators from the Angular CLI:

```
nx g component --project=testbed FOO
nx g service --project=testbed FOO
```
