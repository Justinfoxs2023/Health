import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { errorService } from '../../error';
import { http } from '../index';

describe('HTTP Client', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('应该发送GET请求', async () => {
    const data = { id: 1, name: '测试' };
    mock.onGet('/api/test').reply(200, data);

    const response = await http.get('/api/test');
    expect(response.data).toEqual(data);
  });

  it('应该发送POST请求', async () => {
    const requestData = { name: '测试' };
    const responseData = { id: 1, ...requestData };
    mock.onPost('/api/test', requestData).reply(200, responseData);

    const response = await http.post('/api/test', requestData);
    expect(response.data).toEqual(responseData);
  });

  it('应该发送PUT请求', async () => {
    const requestData = { id: 1, name: '测试更新' };
    mock.onPut('/api/test/1', requestData).reply(200, requestData);

    const response = await http.put('/api/test/1', requestData);
    expect(response.data).toEqual(requestData);
  });

  it('应该发送DELETE请求', async () => {
    mock.onDelete('/api/test/1').reply(200);

    const response = await http.delete('/api/test/1');
    expect(response.status).toBe(200);
  });

  it('应该处理请求错误', async () => {
    const errorData = { message: '请求失败' };
    mock.onGet('/api/test').reply(400, errorData);

    const errorServiceSpy = jest.spyOn(errorService, 'handleError');

    try {
      await http.get('/api/test');
    } catch (error) {
      expect(errorServiceSpy).toHaveBeenCalled();
    }
  });

  it('应该处理网络错误', async () => {
    mock.onGet('/api/test').networkError();

    const errorServiceSpy = jest.spyOn(errorService, 'handleError');

    try {
      await http.get('/api/test');
    } catch (error) {
      expect(errorServiceSpy).toHaveBeenCalled();
    }
  });

  it('应该处理超时错误', async () => {
    mock.onGet('/api/test').timeout();

    const errorServiceSpy = jest.spyOn(errorService, 'handleError');

    try {
      await http.get('/api/test');
    } catch (error) {
      expect(errorServiceSpy).toHaveBeenCalled();
    }
  });

  it('应该支持请求配置', async () => {
    const headers = { 'X-Custom-Header': 'value' };
    mock.onGet('/api/test', { headers }).reply(200);

    const response = await http.get('/api/test', { headers });
    expect(response.status).toBe(200);
  });

  it('应该支持响应拦截器', async () => {
    const data = { id: 1, name: '测试' };
    mock.onGet('/api/test').reply(200, data);

    const interceptor = http.interceptors.response.use(response => {
      response.data.intercepted = true;
      return response;
    });

    const response = await http.get('/api/test');
    expect(response.data.intercepted).toBe(true);

    http.interceptors.response.eject(interceptor);
  });

  it('应该支持请求拦截器', async () => {
    mock.onGet('/api/test').reply(config => {
      return [200, { headers: config.headers }];
    });

    const interceptor = http.interceptors.request.use(config => {
      config.headers = {
        ...config.headers,
        'X-Intercepted': 'true',
      };
      return config;
    });

    const response = await http.get('/api/test');
    expect(response.data.headers['X-Intercepted']).toBe('true');

    http.interceptors.request.eject(interceptor);
  });
});
