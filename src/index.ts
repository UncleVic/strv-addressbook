import { App } from './App';

new App()
  .start()
  .then()
  .catch(err => {
    console.log(err.toString());
    process.exit(1);
  });
