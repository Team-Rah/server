


#Routes
## /blueocean/api/v1

### /user

| path        | METHOD      |HEADER                  | REQ                                       | RES                                               |USE CASE                 |                        
| :--- | :----: | ---------------------- | :----: | :----: | ---: |
| / | GET| NONE |  |  {
                                                                                                    data: [ {username} ]
                                                                                                    }                                                |                         |

| /           | POST        |NONE                    | {                                         |
                                                          username: string, no longer than 20,
                                                          email: string
                                                          password: string, no longer than 15
                                                          img: URL for user profile pic
                                                        }                                        