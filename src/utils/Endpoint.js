const ip = '10.107.88.188:8001';

const Endpoint = {
  prod: `http://${ip}/api/v1`,
  socket: `ws://${ip}`,
  timeout: 3000,
};

export default Endpoint;
