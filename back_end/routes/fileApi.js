var express = require('express');
var router = express.Router();
var readline = require('readline');
var fs = require('fs');
var os = require('os');
var sizeOf = require('image-size');
const models = require('../db/db')
const mysql = require('mysql')
const $sql = require('../db/sqlMap');
var fs = require("fs")
var image = require("imageinfo");
// const { parseComponent } = require('vue-template-compiler');

const conn = mysql.createConnection(models.mysql)
conn.connect()


// 生成COCO格式的JSON文件
router.post('/createJSON', (req, res) => {
    const params = req.body;
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var time = year + '' + month + '' + day + '' + hour + '' + minute + '' + second;
    var dimensions = sizeOf("./public/images/" + params.picture_id + ".jpg");
    var tag = "";
    console.log("123")
    const sel_sql = $sql.tag.select + " where picture_id = '" + params.picture_id + ".jpg'"
    console.log(sel_sql)
    conn.query(sel_sql, params.picture_id + ".jpg", (error, results) => {
        if (error) {
            console.log(err)
        }
        if (results.length != 0 && params.picture_id + ".jpg" == results[0].picture_id) {
            tag = results[0].tag // 表示标注已经存在
            if (!fs.existsSync("./public/file/" + "task" + params.task_id)) {
                fs.mkdir("./public/file/" + "task" + params.task_id, 0777, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("initial creat done!");
                    }
                })
            }
            var fReadName = "./public/file/" + params.demo;
            var fWriteName = "./public/file/" + params.picture_id + ".json";
            var fRead = fs.createReadStream(fReadName);
            var fWrite = fs.createWriteStream(fWriteName);

            var objReadline = readline.createInterface({
                input: fRead,
                // 这是另一种复制方式，这样on('line')里就不必再调用fWrite.write(line)，当只是纯粹复制文件时推荐使用  
                // 但文件末尾会多算一次index计数   sodino.com  
                //  output: fWrite,   
                //  terminal: true  
            });
            var out = [
                "",
                '"' + params.picture_id + '.jpg ' + '", ',
                '{ "object": [{ "name": "' + tag + '" }] },',
                time + ',',
                "true,",
                '{ "width": ' + dimensions.width + ', "height": ' + dimensions.height + ', "depth": 3 }',
                ""
            ];
            var index = 0;
            objReadline.on('line', (line) => {
                var tmp = line + out[index];
                fWrite.write(tmp + os.EOL); // 下一行  
                console.log(index, line);
                index++;
            });

            objReadline.on('close', () => {
                console.log('readline close...');
            });

            res.send('0'); // 0 表示标注成功
        } else {
            res.send('-1') // 0 表示标注不存在
        }
    })
})


// 生成PASCAL VOC格式的XML文件
router.post('/createXML', (req, res) => {
    const params = req.body;
    var dimensions = sizeOf("./public/images/" + params.picture_id + ".jpg");
    var tag = "";
    const sel_sql = $sql.tag.select + " where picture_id = '" + params.picture_id + ".jpg'"
    console.log(sel_sql)
    conn.query(sel_sql, params.picture_id + ".jpg", (error, results) => {
        if (error) {
            console.log(err)
        }
        if (results.length != 0 && params.picture_id + ".jpg" == results[0].picture_id) {
            tag = results[0].tag // 表示标注已经存在
            if (!fs.existsSync("./public/file/" + "task" + params.task_id)) {
                fs.mkdir("./public/file/" + "task" + params.task_id, 0777, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("initial creat done!");
                    }
                })
            }
            var fReadName = "./public/file/" + params.demo;
            var fWriteName = "./public/file/" + params.picture_id + ".xml";
            var fRead = fs.createReadStream(fReadName);
            var fWrite = fs.createWriteStream(fWriteName);

            var objReadline = readline.createInterface({
                input: fRead,
                // 这是另一种复制方式，这样on('line')里就不必再调用fWrite.write(line)，当只是纯粹复制文件时推荐使用  
                // 但文件末尾会多算一次index计数   sodino.com  
                //  output: fWrite,   
                //  terminal: true  
            });
            var name = params.picture_id.toString().split("/");
            console.log("123" + name[1]);
            var out = [
                "task" + params.task_id,
                name[1] + ".jpg",
                params.picture_id + ".jpg",
                dimensions.width,
                dimensions.height,
                tag,
                dimensions.width,
                dimensions.height
            ];
            var index = 0;
            objReadline.on('line', (line) => {
                var tmp
                if (line.toString().includes('#')) {
                    var spl = line.toString().split('#');
                    tmp = spl[0] + out[index] + spl[1];
                    index++;
                } else {
                    tmp = line;
                }
                fWrite.write(tmp + os.EOL); // 下一行  
                console.log(index, line);
            });

            objReadline.on('close', () => {
                console.log('readline close...');
            });

            res.send('0'); // 0 表示标注成功
        } else {
            res.send('-1') // 0 表示标注不存在
        }
    })
})


function readFileList(path, filesList) {
    var files = fs.readdirSync(path);
    files.forEach(function(itm, index) {
        var stat = fs.statSync(path + itm);
        if (stat.isDirectory()) {
            //递归读取文件
            readFileList(path + itm + "/", filesList)
        } else {
            var obj = {}; //定义一个对象存放文件的路径和名字
            obj.path = path; //路径
            obj.filename = itm //名字
            filesList.push(obj);
        }
    })
}

// 从文件夹下获取该任务的所有文件
router.post('/getAllFile', (req, res) => {
    const params = req.body
    var fileList = [];
    var path = './public/file/task' + params.task_id + '/'
    readFileList(path, fileList);
    var result = "";
    for (var i = 0; i < fileList.length; i++) {
        result = result + fileList[i].filename + ";";
    }
    console.log(result);
    res.send(result);
})

module.exports = router;