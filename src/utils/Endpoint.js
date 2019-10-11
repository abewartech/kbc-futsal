const ip = '192.168.43.139:8001';

const Endpoint = {
  prod: `http://${ip}/api/v1`,
  socket: `ws://${ip}`,
  timeout: 3000,
};

export default Endpoint;
