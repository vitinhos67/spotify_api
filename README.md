# Basico para se utilizar a API

A API utiliza o banco de dados não relacionais mongodb, para utilizar a API e necessario ter uma conta e criar um DB no site.

<br> 

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
GET: {
  "username":"",
  "email":"",
  "password":""
}
```

```
Reponse 201: {
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
Reponse 200: {
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