import axios from 'axios';

const basePath = '/auth';

export const authTransport = {
  deleteModel: (deviceId: string): Promise<any> => axios.delete(`${basePath}`, { params: { deviceId } })
};
