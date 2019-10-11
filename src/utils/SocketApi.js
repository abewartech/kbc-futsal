import opensocket from 'socket.io-client';
import Endpoint from './Endpoint';
import AsyncStorage from '@react-native-community/async-storage';

const socket = opensocket(Endpoint.socket);

socket.on('requestId', () => {
  let user = ['username', 'role', 'token', 'id'];
  AsyncStorage.multiGet(user, (err, result) => {
    if (err) {
      alert(err);
    } else {
      const id = result[3][1];
      const role = +result[1][1];
      socket.emit('userConnected', {id, role});
    }
  });
});

export default socket;
