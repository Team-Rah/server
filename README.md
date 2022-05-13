# INSTRUCTIONS:
1. ## GIT CLONE REPO
    ### git clone <repo name>
2. ## INSTALL DEPENDENCIES
    ### npm install



# SCRIPT COMMANDS
1. ## SEED DATABASE WITH 50 USERS
    ### npm run seed
2. ## RUN IN DEV MODE WITH NODEMON
    ### npm run dev




#Routes
## /blueocean/api/v1

### /user

| PATH | METHOD | HEADER | REQ | RES | USE CASE |
|---|---|---|---|---|---|
| / | GET | NONE | NONE | { users:[{ username: "test", email: "test@gmail.com", img: "https://test.com/profilepic.jpg", friends:[{username:"test", email: "test@gmail.com"}] }] } | GET ALL USERS |
| / | POST | Authorization: "Bearer TOKEN" | { username: string no longer than 15, password: string no longer than 15. email: string, img: URL string } | { _id: user ID (unque) user: username token: a token for validation message: a string IE "USER CREATED" \|\| "USER EXIST" } | CREATE A SINGLE USER |


