Hi! Welcome to my NodeJS, ExpressJS, MongoDB authentication API.

Hosted API URL : <a href="https://node-backend-auth.onrender.com/" target="_blank"> https://node-backend-auth.onrender.com/ </a>

API Endpoints : 

Register User : 

Endpoint : https://node-backend-auth.onrender.com/auth/register
Rquest Method : POST
Requset headers : 
Content-Type : application/json
payload : 
{
  "email": "EMAIL_ADDRESS",
  "name": "NAME",
  "password": "PASSWORD"
}


Login User : 

Endpoint : https://node-backend-auth.onrender.com/auth/login
Request Method : POST
Requset headers : 
Content-Type : application/json
payload : 
{
  "email": "EMAIL_ADDRESS",
  "password": "PASSWORD"
}

Response : Access and Refresh tokens



Protected Route :

Endpoint : https://node-backend-auth.onrender.com/
Request Method : GET
Request Headers : 
"authorization" : "bearer ACCESS-TOKEN"


Generate New Token : 

Endpoint : https://node-backend-auth.onrender.com/auth/refresh-token
Request Method : POST
Request Header : 
Content-Type: application/json
payload : 
{
    "refreshToken": "REFRESH_TOKEN"
}

Response: new access and refresh token
