import { App } from './App';

new App()
  .start()
  .then()
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
