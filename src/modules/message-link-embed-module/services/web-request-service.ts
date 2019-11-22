import { XMLHttpRequest } from 'xmlhttprequest';
import { injectable } from 'inversify';

type Resolve = (value?: string | PromiseLike<string>) => void;
type Reject = (reason?: any) => void;
const TIMEOUT: number = 500;
const OK: number = 200;

@injectable()
export default class WebRequestService {
    async getContentType(url: string, timeout: number = TIMEOUT): Promise<string> {
        return new Promise<string>((resolve: Resolve, reject: Reject): void => {
            const xhr: XMLHttpRequest = new XMLHttpRequest();
            xhr.timeout = timeout;
            xhr.open('HEAD', url);
            xhr.onreadystatechange = () => {
                if(xhr.readyState === xhr.DONE) {
                    if(xhr.status === OK) {
                        resolve(xhr.getResponseHeader('Content-Type'));
                    }
                    else {
                        reject(xhr.statusText);
                    }
                }
            }
            xhr.onerror = () => reject(xhr.statusText);
            xhr.send();
        });
    }
}