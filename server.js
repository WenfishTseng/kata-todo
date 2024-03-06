const http = require('http');
const { v4: uuid } = require('uuid');
const errorHandle = require('./handler/errorHandle');

const todos = [];
const requestListener = (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json',
  };
  let body = '';
  req.on('data', (chunk) => (body += chunk));

  if (req.url == '/todos' && req.method == 'GET') {
    // 取得
    res.writeHeader(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos,
      })
    );
    res.end();
  } else if (req.url == '/todos' && req.method == 'POST') {
    // 新增
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        const todo = { title, id: uuid() };
        todos.push(todo);
        // 回傳資料
        res.writeHeader(200, headers);
        res.write(
          JSON.stringify({
            status: 'success',
            data: todos,
          })
        );
        res.end();
      } catch (error) {
        errorHandle(res);
      }
    });
  } else if (req.method == 'PATCH' && req.url.startsWith('/todo/')) {
    // 修改
    req.on('end', () => {
      const id = req.url.split('/').pop();
      const newTitle = JSON.parse(body).title;
      const index = todos.findIndex((todo) => todo.id == id);
      if (newTitle != undefined && index != -1) {
        todos[index].title = newTitle;
        res.writeHeader(200, headers);
        res.write(
          JSON.stringify({
            status: 'success',
            data: todos,
          })
        );
        res.end();
      } else {
        errorHandle(res);
      }
    });
  } else if (req.method == 'DELETE' && req.url.startsWith('/todo/')) {
    // 刪除
    const id = req.url.split('/').pop();
    const index = todos.findIndex((todo) => todo.id == id);
    if (index != -1) {
      todos.splice(index, 1);
      res.writeHeader(200, headers);
      res.write(
        JSON.stringify({
          status: 'success',
          data: todos,
        })
      );
      res.end();
    } else {
      errorHandle(res);
    }
  } else if (req.method == 'OPTIONS') {
    res.writeHeader(200, headers);
    res.end();
  } else {
    // error
    errorHandle(res);
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.port || 3005);
