module.exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'winter is coming'
    }),
  }

  return response
};