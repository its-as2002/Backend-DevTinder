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
# combining the above two Api we can make one 
- POST /request/send/:status/:userId
---------------------------------------------
- POST /request/view/accepted/:requestId
- POST /request/view/rejected/:requestId
# combining the above two Api we can make one
- POST  /request/view/:status/:requestId

## userRouter

- /user/connections
- /user/requests
- /user/feed 
