# **Backend-Template**

This is a simple template for a backend with express.js and connection to mongoDB.

# Used Dependencies in this template
- dotenv
- mongoose
- express
- cors
- morgan

# Folder structure:
- controller
- middleware
- models
- routes
- seeding

# to start
create .env file with 4 Variables after this schema: 
DB_USER=  Your Mongodb Username 
DB_PASS=  Your MongdoDB Password
DB_HOST=  Your MongoDB Host 
DB_NAME=  Your MongoDb DataBase Name
PORT=     Port for your Localhost

You can copy the following empty scheme and paste it in your .env file to fill it out:
DB_USER=   
DB_PASS=  
DB_HOST=   
DB_NAME=  
PORT=     


If you use a "!" or a "?" in your password, it could be required to change it with the following combinations:
! === %21
? === %40

Type in terminal
1.  npm i 
2.  npm start