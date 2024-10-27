### DevTinder API

## authRouter

- POST /signUp
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
# combining the above two api we can make one 
- POST /request/send/
- POST /request/send/accepted/:userId
- POST /request/send/rejected/:userId

## userRouter

- /user/Connections
- /user/requests
- /user/feed - Gets you the profile of another users
