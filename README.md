# Basico para se utilizar a API

A API utiliza o banco de dados não relacionais mongodb, para utilizar a API e necessario ter uma conta e criar um DB no site.

<br> 

<p>O arquivo .env e necessario para guardar as credenciais do codigo, até o momento, elas são:</p>

<li>client_id: necessario para autenticar com a API do spotify.</li>
<li>client_secret = necessario para autenticar com a API do spotify.</li>
<li>sess = Um secret para o modulo express.session, faz o uso de cookies.</li>
<li>mongodb_uri = Mongoose string connection, String para conectar ao mongodb, link abaixo, basta subistituir os dados.</li>
<li>json_web_secret = secret para o jwt.</li>

<br>

.env sintaxe: 
```
client_id =
client_secret = 
sess = 
mongodb_uri = 
json_web_secret =  
password = 
```


### Mongoose string connection

```
mongodb+srv://<username>:<password>@cluster0.5deos.mongodb.net/database
 ```
</br>


Após se conectar, você tera acessos as rotas da API.

# Rotas



<h2>User</h2>

<br>

```
localhost:port/user
```
A rotas de usuarios podem ser usado passando o mesmo parametro, basta escolher qual tipo de requisição HTTP será utilizada, entre ela temos POST,GET até o momento.
<br><br>
<h3>POST<h3>

<p>utilizada para criar um usuario. </p>


```
body: {
  "username":"",
  "email":"",
  "password":""
}
```

```
Response 201: {
	"userCreate": {
		"username": "victor",
		"email": "email@email.com",
		"password": "hash_password",
		"tracks_liked": [],
		"_id": "54553tgrg4g2l4785das",
		"created_at": "2022-11-02T13:25:53.658Z",
		"__v": 0
	}
}
```

GET

<p>Utilizada para retornar todos os usuario.
Não e necessario passar dados neste GET.
  </p>

  ```
Response 200: {
	"users": [
		{
			"_id": "635049ba8210cbe7b4116268",
			"username": "ola23",
			"email": "olmundo@email.com",
			"password": "$2a$10$lKZ3RnECdLpX9pLn0TxgjuTHOsWb.tdSEp8cSLCAaHuj6BwwFBSoy",
			"tracks_liked": [
				"48vDIufGC8ujPuBiTxY8dm"
			],
			"created_at": "2022-10-19T19:02:18.020Z",
			"__v": 0
		},
		
```
<br></br>

<h2>Tracks</h2>

certifique-se de emitir um token antes de tentar acessar as rotas para alterar dados de Users.

Encontrar uma track:
```
METHOD: GET
q: track_name

localhost:port?q=Heaven+Up+There
```

```
Response 200: "href": "https://api.spotify.com/v1/search?query=Heaven+Up+There&type=track&offset=0&limit=10",
			"items": [
				{
					"album": {
						"album_type": "album",
						"artists": [
						],
						"available_markets": [

						],
						"external_urls": {
						},
						"href": "https://api.spotify.com/v1/albums/2gnr57XaEBXSDlfbkowBP8",
						"id": "2gnr57XaEBXSDlfbkowBP8",
						"images": [

						],
						"name": "Life After",
						"release_date": "2019-07-12",
						"release_date_precision": "day",
						"total_tracks": 11,
						"type": "album",
						"uri": "spotify:album:2gnr57XaEBXSDlfbkowBP8"
					}

```
<br>

Adicionar uma track a lista do usuario, necessario autenticar através do Bearer Token.


```
METHOD: POST
Header: {
  Authorization: `Bearer toker_account`
}



URI: localhost:port/liked-track?track_id=id_song

```
<br>

Deletar uma track da lista do usuario, necessario autenticar através do Bearer Token.

```
METHOD: DELETE
Header: {
  Authorization: `Bearer toker_account`
}



URI: localhost:port/liked-track?track_id=id_song

```


<h2>Token</h2>

O token e necessario para realizar operações para um usuario, como deletar, adicionar, modificar. Para isso utilizamos

```
METHOD: POST
BODY: {
  "username":"",
  "email":"",
  "password":""
}
URI:localhost:port/auth/token
```
```
Response 200: {
	"statusCode": 200,
	"statusMessage": "success",
	"data": {
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNjI2ZmUxZTM0NDljYmU5ZTJlYWNmZCIsImlhdCI6MTY2NzM5NTY4MywiZXhwIjoxNjY4MDAwNDgzfQ.XgG_b9IHkD7kxQidBo2My3YlaftIp8M3IKWdAsUQIWY"
	}
}
```