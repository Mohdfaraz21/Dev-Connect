const express = require("express");

const app = express();

const {adminAuth} = require("./middlewares/auth");

app.use("/admin", adminAuth);

/* app.get("/user", (req, res) => {
    res.send("");
})
 */

app.get("/admin/getAllData", (req, res) => {
    res.send("User Data Send");
})
app.get("/admin/deleteUser", (req, res) => {
    res.send("User Data Deleted.");
})

/* app.use("/test",(req, res) => {
    res.send("Hello from the server!!..");
}); */

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000....");
    
});