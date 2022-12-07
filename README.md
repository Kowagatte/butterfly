# Butterfly
This is a node server that acts as an API for all of my self-hosted apps. Currently just TopDownShooter and my personal website. 

## Requests

### GET - /tds/account/{USERNAME}/
This will return the account info of the requested user.
Account info is the email, username, rating, and date the account was created.

### POST - /tds/login/{EMAIL}/
This will return the email and password hash of the requested user. The post requires the Requester to include a secret passphrase to retrieve any data. This is to avoid any unauthorized users requesting any user password hashes.

### GET - /damocles/blogs/
Returns a list of all the blogs posted. Currently a blog does not contain any blog data.