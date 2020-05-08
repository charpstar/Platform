export async function validateAndRunService(parser, service, req, res) {
  try {
    const { error, value } = parser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      const responseObject = {
        status: '',
        error: error.details[0].message,
        data: {},
      };
      return res.send(responseObject);
    }
    const result = await service(value, req);
    return res.send(result);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function runServiceWithData(service, data, req, res) {
  try {
    const result = await service(data);
    return res.send(result);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}
