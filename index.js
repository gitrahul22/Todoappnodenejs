const express=require('express');
const app=express();
const path=require('path');
const fs=require('fs');
const { log } = require('console');
//fs.readdir is a method which is used to read directories
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
//static strores the static files such as VanilaJS or simply JS 

app.get('/',function(req,res){
    // res.send("Heloo Bihar");
    fs.readdir(`./files`,function(err,files){
        console.log(files);
        const highlightFile=req.query.highlight||null;
        console.log("chechking the main route"+highlightFile)
        res.render("index", { files: files, highlightFile: highlightFile, markedFiles: markedFiles });
    //yaha render ka time par humko kuch bhi sakte hai .
    
    })
})
app.get('/delete/:filename', function (req, res) {
    console.log("Delete was called");
    const filePath = `./files/${req.params.filename}`;
    fs.unlink(filePath, function (err) {
        if (err) {
            console.error("Error deleting file:", err);
            return res.status(500).send("Error deleting file");
        }
        res.redirect("/");
    });
});
app.get('/files/:filename',function(req,res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,filedata){
        res.render("show",{filename: req.params.filename,filedata:filedata});
        // console.log(filedata)
        console.log("yeh dikhane wala panna hai");
    })
})
// app.get('/markdone/:filename', function (req, res) {
//     console.log("It is marked as done");

//     // const oldFilePath = `./files/${req.params.filename}`;
//     const newFileName = req.params.filename.split(' ').join('');
//     // const newFilePath = `./files/${newFileName}`;
    
//     console.log(newFileName);
//     res.redirect(`/?highlight=${newFileName}`); // Pass the renamed file for highlighting
// });

app.get('/edit/:filename',function(req,res){
    res.render("edit",{filename:req.params.filename});
    
    
})
// app.post()
app.post('/edit',function(req,res) {
    // console.log(req.body.newname);
    fs.rename(`./files/${req.body.prevname}`,`./files/${req.body.newname.split(' ').join('')}.txt`,function(err){
        res.redirect("/"); 
    })
})
app.post('/create',function(req,res) {
    // console.log(req.body.title);
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.detail,function(err){
        res.redirect("/");
    });
})
let markedFiles = [];  // This will store the filenames that are marked

app.get('/markdone/:filename', function (req, res) {
    console.log("I am marked done ");
    const fileName = req.params.filename;
    if (markedFiles.includes(fileName)) {
        // If the file is already marked, unmark it
        markedFiles = markedFiles.filter(file => file !== fileName);
    } else {
        // If the file is not marked, mark it
        markedFiles.push(fileName);
    }

    res.redirect("/?highlight=" + fileName); // Redirect with highlight query
});









app.listen(3000);