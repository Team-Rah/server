


#Routes
## /blueocean/api/v1

### /user

| PATH | METHOD | HEADER | REQ | RES | USE CASE |
| --- | --- | --- | --- | --- | --- |
| / | GET |  |  | {data: [ {username} ]} | GET ALL USERS |
| / | POST |  | {username: string, no longer than 20,email: string, password: string, no longer than 15, img: URL for user profile pic} |  | CREATE A SINGLE USER |
| / | PUT |  |  |  | EDIT A SINGLE USERS |
