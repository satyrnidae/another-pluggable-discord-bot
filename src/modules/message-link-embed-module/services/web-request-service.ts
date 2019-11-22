import { injectable } from 'inversify';
import { getHttpResponse } from 'api';

const TIMEOUT = 500;
const OK = 200;

@injectable()
export default class WebRequestService {
    async getContentType(url: string, timeout: number = TIMEOUT): Promise<string> {
        const httpResponse = await getHttpResponse('HEAD', url, timeout);
        if(httpResponse.status !== OK) {
            return Promise.reject(httpResponse.statusText);
        }
        return httpResponse.getResponseHeader('Content-Type');
    }
}