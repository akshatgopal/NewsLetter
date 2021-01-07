const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { response } = require("express");
const { json } = require("body-parser");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signup.html");
})

app.post("/failure",(req,res)=>{
    res.redirect("/");
})

app.post("/",(req,res)=>{
    const fName = req.body.fname;
    const lName = req.body.lname;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status : "subscribed",
                merge_fields:{
                    FNAME: fName,
                    LNAME : lName
                }
            }
        ]

    };
    const jsonData = JSON.stringify(data);
    const url = "https://us2.api.mailchimp.com/3.0/lists/23f13f1760";
    const options = {
        method: "POST",
        auth : "akshat:27a5054bfb59ca44cecf7fee2ae5e3b9-us2"
    }
    const request = https.request(url,options,(response)=>{
        if (response.statusCode === 200){
            res.sendFile(__dirname+ "/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        // response.on("data",(data)=>{
        //     console.log(JSON.parse(data));
        // })
    })
    request.write(jsonData); // to send it to the server side.
    request.end();// to end the request.
});
app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is running on port 3000");
})
