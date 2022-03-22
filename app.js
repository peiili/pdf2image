const fs = require('fs');
const path = require('path');
const express = require('express');
const { exec } = require('child_process');
const router = express.Router();
const multer = require('multer');
const app = express();

const port = 3000;
app.listen(port, () => {
    const path = `http://127.0.0.1:${port}`
    switch (process.platform){
        case "darwin":
            exec(`open ${path}`)
            break;
        case "win32":
            exec(`start ${path}`)
            break;
        default:
            exec('xdg-open',[`${path}`])
    }
    console.log(`App run ${path}`);
});

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname,'/tmp/my-pdf'));
    },
    filename(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

router.get('/', (req,res) => {
    const file = fs.readFileSync('src/index.html', 'utf-8')
    res.status(200).send(file);
})

const outBasePath = './img/'

router.post('/uploader',upload.single('file'), (req,res) => {  
    const outpath = req.file.originalname.replace('.pdf','')
    const dirs = fs.readdirSync(outBasePath)
    const hasDir = dirs.find(e=>e===outpath)
    if(!hasDir){
        fs.mkdirSync(outBasePath+outpath)
    }
    fs.readFileSync(path.join(__dirname,'/tmp/my-pdf',req.file.originalname))

    // python main.py 需要被转换的文件  转换后的问卷存放位置 文件夹名称
    exec(`python main.py ${path.join(__dirname,'/tmp/my-pdf',req.file.originalname)} ${path.join(__dirname,outBasePath,outpath)} ${outpath}`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('done');
        console.log(stdout);
        // 在此处会同步等待转换结束后返回响应
        // let files = []
        // files = fs.readdirSync(path.join(__dirname,outBasePath,outpath))
        // res.status(200).send(files)
    })
    // 异步操作
    res.send(JSON.stringify(`转换中，稍后调用http://127.0.0.1:${port}/img?id=${outpath}`));
})

router.get('/img',(req,res) => {
    const {id} = req.query
    let files = []
    files = fs.readdirSync(path.join(__dirname,outBasePath,id))
    res.status(200).send(files)
})

app.use(router)
