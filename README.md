# Basico para se utilizar a API

A API utiliza o banco de dados não relacionais mongodb, para utilizar a API e necessario ter uma conta e criar um DB no site.

<br>

<p>O arquivo .env e necessario para guardar as credenciais do codigo, até o momento, elas são:</p>

|        client_id        |        necessario para autenticar com a API do spotify.        |
|:-----------------------:|:--------------------------------------------------------------:|
|      client_secret      |        necessario para autenticar com a API do spotify.        |
|           sess          | Um secret para o modulo express.session, faz o uso de cookies. |
|       mongodb_uri       |                   Mongoose string connection                   |
|      mongo_db_test      |               Banco MongoDB para desinvolvimento               |
|     json_web_secret     |                       secret para o jwt.                       |
|   reflesh_token_secret  |                    secret para reflesh token                   |
|  expiresIn_access_token |             tempo de validação para o access token             |
| expiresIn_reflesh_token |             tempo de validação para o reflesh token            |
|  mongodb_test_username  |            username para rodar a aplicação do docker           |
|  mongodb_test_password  |            password para rodar a aplicação do docker           |
|         NODE_ENV        |    Utilizado para ver se a aplicação está em desenvolvimento   |
|           PORT          |                     Porta usada em produção                    |
|         PORT_DEV        |                   Porta para desenvolvimento                   |

<br>

.env

```
client_id = 
client_secret = 
sess = 
mongodb_uri = 
mongo_db_test = 
json_web_secret = 
reflesh_token_secret = 
expiresIn_access_token =
expiresIn_reflesh_token =
endpoint = 
NODE_ENV = 
PORT_ENV = 
PORT =
mongodb_test_username = 
mongodb_test_password =

```

### Mongoose string connection

```
mongodb+srv://<username>:<password>@cluster0.5deos.mongodb.net/<database>
```

</br>
Após se conectar, você tera acessos as rotas da API.

# Rotas

### User

<br>

```
localhost:port/user
```

As rotas de usuarios podem ser usado passando o mesmo parametro, basta escolher qual tipo de requisição HTTP será utilizada, entre ela temos POST,GET até o momento.
</br>

<h4>- POST<h4>
<p>Utilizada para criar um usuario. </p>

```
body:
 -username: <username>
 -email: <email>
 -password: <password>
}
```

<h4> - GET<h4>
<p>Utilizada para retornar todos os usuario.
Não e necessario passar dados neste GET.</p>

</br>

### Tracks

Certifique-se de emitir um token antes de tentar acessar as rotas para alterar dados de Users.
Encontrar uma track:

```
METHOD: GET
q: track_name

localhost:port?q=Heaven+Up+There
```

<br>

Adicionar uma track a lista do usuario, necessario autenticar através do Bearer Token.

```
METHOD: POST
Header:
 -Authorization: `Bearer <token>`

URI: localhost:port/liked-track?track_id=id_song
```

<br>

Deletar uma track da lista do usuario, necessario autenticar através do Bearer Token.

```
METHOD: DELETE
URI: localhost:port/liked-track?track_id=id_song

Header:
 - Authorization: Bearer <token>
```

### Token

O token e necessario para realizar operações para um usúario, como por exemplo deletar, adicionar, modificar. Para isso utilizamos

```
Method: POST
URI: localhost:port/auth/token
body:
 - username: <username>
 - email: <email>
 - password": <password>

```

<br></br>

### Playlists

Necessario se autenticar com um usúario através do Bearer token. </br>
Criar uma playlist:

```
Authorization: Bearer <token>

localhost:port/playlist/create
body:
 - name: <nome_playlist>

```

Adicionar uma musica a uma track:

```
Authorization: Bearer <token>
method: POST
body:
 - name: <nome_playlist>
 - track_id: <track_id> // Apenas id validos do spotify
 - reflesh_token: <seu_reflesh_token>
```
