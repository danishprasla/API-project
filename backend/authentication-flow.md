## Backend authentication flow
1. API login route will be hit with a req body consisting of user/email and password
2. API login handler will look for a user with that input variable
3. The hashedPassword for that found user will be compared with the input password
4. If there is a match, the API login route should send back a JWT and a res body. The JWT will hold the user's id, username, and email

## Backend sign-up flow
1. API signup route will be hit with req body which has the username, email, and pw.
2. API signup handler will create a User with the desired inputs (if valid) and a hashedPassword will be created from the pw input.
3. If there are no errors, API signup route should send back a JWT.

## Backend logout flow
1. API logout route will be hit with a req.
2. API logout handler will remove the JWT and will return a JSON success message.