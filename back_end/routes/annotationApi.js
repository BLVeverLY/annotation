var express = require('express')
var router = express.Router();
const multer = require('multer')
const models = require('../db/db')
const mysql = require('mysql')
const $sql = require('../db/sqlMap');
// const { SingleEntryPlugin } = require('webpack');

const conn = mysql.createConnection(models.mysql)
conn.connect()

global.max = 0;

var storage = multer.diskStorage({
    //存储的位置
    destination(req, res, cb) {
        cb(null, "./public/images/task" + (max).toString() + "/");
    },
    //destination: "../public/images/task" + (max).toString() + "/", // 保存的路径，备注：需要自己创建
    //文件名字的确定 multer默认帮我们取一个没有扩展名的文件名，因此需要我们自己定义
    filename(req, file, cb) {
        // cb(null, Date.now() + file.originalname)
        cb(null, file.originalname)

    }
})
const upload = multer({
    storage
})

// 上传图片
router.post('/uploadPicture', upload.single('file'), (req, res) => {
    //线上的也就是服务器中的图片的绝对地址
    var url = "./public/images/task" + (max).toString() + "/" + req.file.filename
    console.log('url', url)
    res.send({
        msg: 'success',
        avatarUrl: url
    })
})

// 上传视频
router.post('/uploadVideo', upload.single('file'), (req, res) => {
    // 没写完。。。
    //线上的也就是服务器中的图片的绝对地址
    var url = "./public/images/task" + (max).toString() + "/" + req.file.filename
    console.log('url', url);
    // 需要安装ffpeg https://blog.csdn.net/dj513dj/article/details/60961970
    // const extractFrames = require('ffmpeg-extract-frames')
    // // extract 3 frames at 1s, 2s, and 3.5s respectively
    // var sql = req.file.filename.split('.');
    // // await is only valid in async functions and the top level bodies of modules
    // extractFrames({
    //     input: url,
    //     output: "./public/images/task" + (max).toString() + "/" + sql[0] + '-frame-%i.jpg',
    //     offsets: [
    //         1000,
    //         2000,
    //         3500
    //     ]
    // });
    // // generated screenshots:
    // // -frame-1.jpg
    // // -frame-2.jpg
    // // -frame-3.jpg
    res.send({
        msg: 'success',
        avatarUrl: url,
    })
})


// 从数据库中获取所有任务
router.post('/getAllTask', (req, res) => {
    //const task = req.body
    const sel_task = $sql.task.alltask
    console.log(sel_task)
    conn.query(sel_task, req, (error, results) => {
        if (error) {
            console.log(error)
            throw error
        }
        console.log(results)
        res.send(results)
    })
})

// 新建任务文件夹，并加入数据库
router.post('/createTask', (req, res) => {
    const params = req.body
    const sel_task = $sql.task.alltask
    console.log(sel_task)
    conn.query(sel_task, req, (error, results) => {
        if (error) {
            console.log(error)
            throw error
        }
        console.log(results)
        max = 0;
        for (var i = 0; results[i] != undefined; i++) {
            if (max < results[i].task_id) {
                max = results[i].task_id;
            }
        }
        max++;
        const insert_task = $sql.task.inserttask
        conn.query(
            insert_task, [max, params.account, "task" + (max).toString()],
            (err, rst) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(rst)
                    var fs = require("fs");
                    //"@/../public" + "task" + (max).toString()
                    fs.mkdir("./public/images/" + "task" + (max).toString(), 0777, function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("creat done!");
                        }
                    })
                    res.send("task" + (max).toString()) // 0 表示用户创建成功
                }
            }
        )
    })
})

// 提交图片标注，加入数据库中
router.post('/submitAnnotation', (req, res) => {
    const params = req.body
    const sel_sql =
        $sql.tag.select + " where picture_id = '" + params.picture_id + "'"
    const add_sql = $sql.tag.add
    console.log(sel_sql)
    conn.query(sel_sql, params.picture_id, (error, results) => {
        if (error) {
            console.log(err)
        }
        if (results.length != 0 && params.picture_id == results[0].picture_id) {
            res.send('-1') // -1 表示标注已经存在
        } else {
            console.log(add_sql);
            conn.query(
                add_sql, [params.picture_id, params.tag],
                (err, rst) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(rst)
                        res.send('0') // 0 表示标注成功
                    }
                }
            )
        }
    })
})

// 修改任务标注状态
router.post('/allok', (req, res) => {
    const params = req.body
    const upd_sql = $sql.task.update
    console.log(upd_sql)
    conn.query(
        upd_sql, [params.task_id],
        (err, rst) => {
            if (err) {
                console.log(err)
            } else {
                console.log(rst)
                res.send('0') // 0 表示标注成功
            }
        }
    )
})

// var fs = require("fs")
// var image = require("imageinfo");

// function readFileList(path, filesList) {
//     var files = fs.readdirSync(path);
//     files.forEach(function(itm, index) {
//         var stat = fs.statSync(path + itm);
//         if (stat.isDirectory()) {
//             //递归读取文件
//             readFileList(path + itm + "/", filesList)
//         } else {
//             var obj = {}; //定义一个对象存放文件的路径和名字
//             obj.path = path; //路径
//             obj.filename = itm //名字
//             filesList.push(obj);
//         }

//     })
// }

// function getFileList(path) {
//     var filesList = [];
//     readFileList(path, filesList);
//     return filesList;
// }

// // 从文件夹下获取该任务的所有图片
// router.post('/getAllPicture', (req, res) => {
//     console.log("123");
//     const params = req.body
//     var imageList = [];
//     var path = './public/images/task' + params.task_id + '/'
//     getFileList(path).forEach((item) => {
//         var ms = image(fs.readFileSync(item.path + item.filename));
//         ms.mimeType && (imageList.push(item.filename))
//     });
//     var result = "";
//     for (var i = 0; i < imageList.length; i++) {
//         result = result + imageList[i] + ";";
//     }
//     res.send(result);
// })

module.exports = router;