# MyContacts - Backend

Built alongside the [JStack course](https://jstack.com.br/), using express and
JS. This is the backend for [MyContacts - Frontend](https://github.com/NeoVier/mycontacts-frontend)

## running locally

First of all, install all dependencies:

```bash
yarn install
```

you need a postgres instace with this configuration (you can tweak this in `src/database/index.js`):

```js
{
  host: 'localhost',
  port: 5432,
  user: 'root',
  password: 'root',
  database: 'mycontacts'
}
```

and then start the server and listen for changes:

```bash
yarn start
```
