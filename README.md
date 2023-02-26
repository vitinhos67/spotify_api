# Basico para se utilizar a API

A API utiliza o banco de dados não relacionais mongoDB, para utilizar a API e necessario ter o banco de dados rodando em sua maquina, e também ter a autenticação com a API do spotify.

<br>

<p>O arquivo .env e necessario para guardar as credenciais do codigo, até o momento, elas são:</p>

|   Variavel de Ambiente: |                            Uso para:                          |
|:-----------------------:|:--------------------------------------------------------------:|
|       client_id        |                 autenticar com a API do spotify.                |
|      client_secret      |                autenticar com a API do spotify
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

```bash
### Mongoose string connection
mongodb+srv://<username>:<password>@cluster0.5deos.mongodb.net/<database>
```
Após se conectar, você tera acessos as rotas da API.

</br>

# Rotas

## Usuario

<br>

```bash
###Endpoint
localhost:port/user
```

As rotas de usuarios podem ser usado passando o mesmo parametro, basta escolher qual tipo de requisição HTTP será utilizada, entre ela temos POST,GET até o momento.
</br>

### POST 
<p>Utilizada para criar um usuario. </p>


<li>username</li>
<li>password</li>
<li>email</li>

### GET

<p>Utilizada para retornar todos os usuario.


</br>

<hr>

## Tracks

```bash
### Endpoint
http://localhost:port/track?q='name'
```


<p>Certifique-se de emitir um token antes de tentar acessar as rotas para alterar dados de Users.
</p>


### GET
<p>Utilize esta roda quando quiser encontrar uma musica</p>


Query:

<li>q</li>
<br/>

Exemplo: <strong>localhost:port?q=Heaven+Up+There</strong>

<br/>

<p>Adiciona uma musica a lista de musicas curtidas do usuario com:</p>

```bash
localhost:port/track/:track_id ### PUT METHOD
```

Header:
<ul>
    <li>Authorization bearer</li>
    <li>Reflesh_Token</li>
</ul>

<p>Deletar uma musica a lista de musicas curtidas do usuario com:</p>

```bash
localhost:port/track/:track_id ### DELETE METHOD
```

Header:
<ul>
    <li>Authorization bearer</li>
    <li>Reflesh_Token</li>
</ul>


### Token

<p>O token e necessario para realizar operações para um usúario, como por exemplo deletar, adicionar, modificar. Para isso utilizamos com o metodo <strong>POST</strong>:</p>

```bash
http://localhost:port/auth/token ### POST Method
```
Body:

<ul>
    <li>username</li>
    <li>email</li>
    <li>password</li>
</ul>



Para atualizarmos o token de um usuario utilizamos:

```bash
http://localhost:port/reflesh_token/:reflesh_token ### POST Method
```

<hr>

### Playlists

Necessario se autenticar com um usúario através do Bearer token. </br>


Criar uma playlist com o metodo <strong>POST</strong>:

```bash
localhost:port/playlist/create ### POST Method
```
<p>Body:</p>

<ul>
    <li>name</li>

</ul>

<p>Header:</p>
<ul>
    <li>Authorization bearer</li>
    <li>Reflesh_Token</li>
</ul>

Adicionar uma track a uma playlist:

```bash
http://localhost:port/playlist/add/track ### PUT Method
```
<p>Body:</p>

<ul>
    <li>name - Nome da Playlist </li>
     <li>track_id</li>

</ul>


<p>Header:</p>
<ul>
    <li>Authorization bearer</li>
    <li>Reflesh_Token</li>
</ul>
