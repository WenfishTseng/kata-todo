function errorHandle(res) {
  const headers = {
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json',
  };
  res.writeHeader(400, headers);
  res.write(
    JSON.stringify({
      status: 'failed',
      message: '無此網站, 或沒有此ID',
    })
  );
  res.end();
}

module.exports = errorHandle;
