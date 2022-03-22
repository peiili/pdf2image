### pdf转image

该项目是一个使用`nodejs` 结合`python3` 通过`poppler` 完成的一个pdf转image的工具，为了解决用户上传pdf文件后那个能够在移动端网页中直接预览。因为我的主程序是用nodejs作为后端服务，所以就没有使用`python`做很重的处理

最开始的时候也想直接使用`nodejs`直接调用`poppler`进行完成，但做完以后发现在转换速度上跟`python3`的速度相差很多，所以就放弃了，决定使用`child_process`执行`python`的脚本进行转换

#### 环境准备

```
python3.6+
nodejs
poppler
```

#### Install

安装`nodejs`运行依赖包

```shell
yarn
```

或

```shell
npm install
```

安装python依赖包[pdf2image](https://pypi.org/project/pdf2image/)

```shell
pip install pdf2image
```

运行中会依赖[`poppler`](https://poppler.freedesktop.org/) 具体按装方式可参考文档

#### run 

```shell
node app.js
```

因为没有做监听，每次修改完app.js代码后程序不会热更新，需要手动重启

#### path

在浏览器输入，在网页中上传pdf文件

```html
http://127.0.0.1:3000
```

#### 接口

上传

``` 
post http://127.0.0.1:3000/uploader
```

body：

```
form-data
{
	file:xxx.pdf
}
```

查询结果

```
get http://127.0.0.1:3000/img?id=文件名称
```

tips: 使用postman 调用接口，如果文件名成有中文，会导致上传后文件名称乱码，这是postman导致的，可以将文件名修改英文

