const express=require('express');
const mongodb=require('mongodb');
const app=express();
const http=require('http').createServer(app);
const url="mongodb+srv://root:root@cluster0.vcvx4oj.mongodb.net/?retryWrites=true&w=majority";
var MongoClient=mongodb.MongoClient;
var ObId=mongodb.ObjectId;
const expressFormidable=require("express-formidable");
const { Console } = require('console');
const sendmail=require('./sendmail')


app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials',true);
    next();
})

const multer=require('multer');
const cors=require('cors');
app.use(cors());
const upload=multer({
    storage:multer.diskStorage({
        destination:function(req,file,cb)
        {
            cb(null,"uploads")
        },
        filename:function(req,file,cb)
        {
            cb(null,file.filename+"-"+Date.now()+".doc")
        }
    })
});

var port =3000;
app.use(express.static(__dirname+'/dist/'));
app.use(expressFormidable());
http.listen(process.env.PORT || port,function(){
    
    app.get('*',async (req,res)=>{
        res.sendFile(__dirname+"/dist/index.html");
    })
    console.log("server started");
   MongoClient.connect("mongodb+srv://root:<password>@mevn.owohcup.mongodb.net/?retryWrites=true&w=majority",function(error,client){
    if(error)
    {
        console.error(error);
        return ;
    }
    db=client.db("prblmdb");
    global.db=db;
    console.error("db connected");
    // ,upload.single('')

    app.post("/upload",async function(req,res){
        let username=req.fields.username;
        let pass=req.fields.password;
        let type=req.fields.choice;
        console.log(type);
        console.log(req.fields);
        console.log(req.files);
        // var file=req.files.file;
        // var filename=file.name;
        var unname=await db.collection(type).findOne({
            'uname':username
        });
        console.log(unname);
        if(unname==null)
        {
            res.json({
                status:"error",
                message:"no user found"
            })
            return;
        }
        // console.log(unname.password);
        if(pass!=unname.password)
        {
            res.json({
                status:"error",
                message:"password is wrong"
            })
            return;
        }
        res.json({
            status:"success",
            message:"Login Successfully",
            uname:username,
            type:type
        });
        // if(pass!=unname)

    });

    app.post("/login",async function(req,res){
        console.log("ghf");
        let username=req.fields.username;
        let pass=req.fields.password;
        let type=req.fields.choice;
        console.log(type);
        console.log(req.fields);
        var unname=await db.collection(type).findOne({
            'uname':username
        });
        console.log(unname);
        if(unname==null)
        {
            res.json({
                status:"error",
                message:"no user found"
            })
            return;
        }
        // console.log(unname.password);
        if(pass!=unname.password)
        {
            res.json({
                status:"error",
                message:"password is wrong"
            })
            return;
        }
        res.json({
            status:"success",
            message:"Login Successfully",
            uname:username,
            type:type
        });
        // if(pass!=unname)

    });
    app.post("/allprob",async function(req,res){
        // await db.collection('problem').find({}).toArray(async function(err, result) {
        //     if (err) throw err;
        //     res=result;
        //     console.log(result);})
        let data=await db.collection('problem').find({}).toArray();
        console.log(data);
        res.json(data);
        console.log(res);
        return;
    })
    app.post("/profile",async function(req,res){
        const uname=req.fields.uname;
        const typ=req.fields.typ;
        const dta=await db.collection(typ).findOne({'uname':uname});
        res.json(dta);
        return;
    })
    app.post("/postproblem",async function(req,res){
        // console.log(req);
        let by=req.fields.by;
        let district=req.fields.dis;
        let category=req.fields.cate;
        let desc=req.fields.desc;
        const date = new Date();
        console.log(date.getDate());
        let ids=date.getTime();
        console.log(typeof(ids));
        await db.collection('problem').insertOne({
            'pid':ids,
            by:by,
            district:district,
            category:category,
            desc:desc,
            status:"new created",
            date:date
        })
        res.json({
            status:"success",
            message:"Successfully Registered"
        });
    })
    app.post("/chngstatus",async function(req,res){
        const pid=req.fields.id;
        const status=req.fields.status;
        console.log(pid);
        console.log(status);
        console.log(typeof(pid));
        let f=parseInt(pid);
        console.log(typeof(f));
        const ygy=await db.collection('problem').find({pid:f}).toArray();
        console.log(ygy);
        let myquery = { pid: f };
        let newvalues = { $set: {status:status} };
         db.collection('problem').updateOne(myquery, newvalues, function(err, res) {
             if (err) throw err;
            console.log("1 document updated");
         });
         res.json({
            status:"success",
            message:"Successfully Updated"
        });
        return;    
    })
    app.post("/editprobdone",async function(req,res){
        let pid=parseInt(req.fields.pid);
        let desc=req.fields.desc;
        let dis=req.fields.dis;
        let cat=req.fields.cat;
        await db.collection('problem').updateOne({'pid':pid},{$set:{'district':dis,'category':cat,'desc':desc}},(err,res)=>{
            if(err)
              throw err;
            console.log("Updated");  
        })
        res.json({
            status:"success",
            message:"Successfully Updated"
        });
    })
    app.post("/editprob",async function(req,res){
        console.log(req.fields);
        let pid=parseInt(req.fields.pid);
        const r=await db.collection('problem').findOne({'pid':pid});
        res.json(r);
        return ;
    })
    app.post("/updateua",async function(req,res){
         console.log(req.fields);
         let uname=req.fields.uname;
         let name=req.fields.name;
         let phone=req.fields.phone;
         let address=req.fields.address;
         let email=req.fields.email;
         let pass=req.fields.pass;
         let gender=req.fields.gender;
         let typ=req.fields.typ;
         let myquery = { uname: uname };
         let newvalues = { $set: {name: name, gender:gender,password:pass,email:email,conno:phone,district:address } };
         db.collection(typ).updateOne(myquery, newvalues, function(err, res) {
             if (err) throw err;
            console.log("1 document updated");
         });
         res.json({
            status:"success",
            message:"Successfully Updated"
        });
        return;
    })
    app.post("/usprob",async function(req,res){
        let un=req.fields.x;
        let data=await db.collection('problem').find({'by':un}).toArray();
        console.log(data);
        res.json(data);
        console.log(res);
        return;
    })
    app.post("/adprob",async function(req,res){
        let uname=req.fields.uname;
        let typ=req.fields.typ;
        let dis=await db.collection(typ).find({'uname':uname}).toArray();
        let d=dis[0].district;
        console.log(d);
        let dta=await db.collection('problem').find({'district':d}).toArray();
        console.log(dta);
        res.json(dta);
        // console.log(res);
        return;
    })
    app.post("/registration",async function(request,res){
        const name=request.fields.name;
        const username=request.fields.username;
        const gender=request.fields.gender;
        const password=request.fields.password;
        const email=request.fields.email;
        const conno=request.fields.conno;
        const district=request.fields.district;
        const type=request.fields.type;
        if(!name || !email || !password)
        {
            res.json({
                status:"error",
                message:"Please enter details correctly"
            });
            return;
        }
        console.log(type)
        var unname=await db.collection(type).findOne({
            uname:username
        });
        console.log(unname);
        if(unname!=null)
        {
            res.json({
                status:"error",
                message:"UserName is already registered"
            });
            return;
        }
        await db.collection(type).insertOne({
            name:name,
            uname:username,
            gender:gender,
            password:password,
            email:email,
            conno:conno,
            district:district,
        })
        res.json({
            status:"success",
            message:"Successfully Registered"
        });
    })
    app.post("/forgotpass",async (req,res)=>{
        console.log(req.fields);
        let user=req.fields.user;
        let typ=req.fields.type;
        // console.log(rrq)
        let udata=await db.collection(typ).findOne({'uname':user});
        if(udata==null)
        {
            res.json({
                status:"error",
                msg:"Username not valid"
            })
            return;
        }
        let pass=udata.password;
        let email=udata.email;
        console.log(email);
        sendmail(email,pass);
        res.json({
            status:"success",
            msg:"Password is sent to registered email"
        })
        return;
    })
    app.get("*",(req,res)=>{
        res.json({
            status:404,
            message:"The page you are searching doesn't exist"
        });
    })
   });
});
