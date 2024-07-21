<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```




## Documentation de l'API NestJS
Table des matières
Authentification
Login
Valider le Token
Utilisateurs
Créer un utilisateur
Mettre à jour un utilisateur
Changer le mot de passe
Amis
Envoyer une demande d'ami
Accepter une demande d'ami
Décliner une demande d'ami
Supprimer un ami
Récupérer les amis
Récupérer les demandes d'amis
Chat
Envoyer un message
Récupérer les messages
Authentification
Login
URL : /auth/login
Méthode : POST
Description : Authentifier un utilisateur.
Corps de la requête :
json
Copier le code
{
  "email": "user@example.com",
  "password": "password123"
}
Réponse :
json
Copier le code
{
  "token": "jwt-token"
}
Valider le Token
URL : /auth/validate-token
Méthode : GET
Description : Valider le token JWT.
En-têtes :
json
Copier le code
{
  "Authorization": "Bearer jwt-token"
}
Réponse :
json
Copier le code
{
  "valid": true
}
Utilisateurs
Créer un utilisateur
URL : /users/create
Méthode : POST
Description : Créer un nouvel utilisateur.
Corps de la requête :
json
Copier le code
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123"
}
Mettre à jour un utilisateur
URL : /users/update/:id
Méthode : POST
Description : Mettre à jour les informations d'un utilisateur.
En-têtes :
json
Copier le code
{
  "Authorization": "Bearer jwt-token"
}
Corps de la requête :
json
Copier le code
{
  "username": "updateduser",
  "email": "updateduser@example.com"
}
Changer le mot de passe
URL : /users/change-password
Méthode : POST
Description : Changer le mot de passe d'un utilisateur.
En-têtes :
json
Copier le code
{
  "Authorization": "Bearer jwt-token"
}
Corps de la requête :
json
Copier le code
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
Amis
Envoyer une demande d'ami
URL : /friends/request
Méthode : POST
Description : Envoyer une demande d'ami à un utilisateur.
En-têtes :
json
Copier le code
{
  "Authorization": "Bearer jwt-token"
}
Corps de la requête :
json
Copier le code
{
  "friendUsername": "frienduser"
}
Accepter une demande d'ami
URL : /friends/accept/:requestId
Méthode : POST
Description : Accepter une demande d'ami.
En-têtes :
json
Copier le code
{
  "Authorization": "Bearer jwt-token"
}
Décliner une demande d'ami
URL : /friends/decline/:requestId
Méthode : POST
Description : Décliner une demande d'ami.
En-têtes :
json
Copier le code
{
  "Authorization": "Bearer jwt-token"
}
Supprimer un ami
URL : /friends/remove/:friendId
Méthode : DELETE
Description : Supprimer un ami.
En-têtes :
json
Copier le code
{
  "Authorization": "Bearer jwt-token"
}
Récupérer les amis
URL : /friends
Méthode : GET
Description : Récupérer la liste des amis de l'utilisateur connecté.
En-têtes :
json
Copier le code
{
  "Authorization": "Bearer jwt-token"
}
Paramètres de requête :
page : Numéro de la page (par défaut: 1)
limit : Nombre d'amis par page (par défaut: 20)
Récupérer les demandes d'amis
URL : /friends/requests
Méthode : GET
Description : Récupérer la liste des demandes d'amis reçues par l'utilisateur connecté.
En-têtes :
json
Copier le code
{
  "Authorization": "Bearer jwt-token"
}
Chat
Envoyer un message
URL : /chat/send
Méthode : POST
Description : Envoyer un message à un utilisateur.
En-têtes :
json
Copier le code
{
  "Authorization": "Bearer jwt-token"
}
Corps de la requête :
json
Copier le code
{
  "receiverId": 123,
  "content": "Hello, how are you?"
}
Récupérer les messages
URL : /chat/messages
Méthode : GET
Description : Récupérer les messages échangés avec un utilisateur.
En-têtes :
json
Copier le code
{
  "Authorization": "Bearer jwt-token"
}
Paramètres de requête :
friendId : ID de l'ami avec qui les messages sont échangés



## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
