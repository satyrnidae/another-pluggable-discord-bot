import { XMLHttpRequest } from 'xmlhttprequest';

const TIMEOUT = 500;

export function getHttpResponse(method: string, url: string, timeout: number = TIMEOUT): Promise<XMLHttpRequest> {
    return new Promise<XMLHttpRequest>((resolve: Resolve<XMLHttpRequest>, reject: Reject) => {
        const xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.timeout = timeout;
        xhr.open(method, url);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === xhr.DONE) {
                if(xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr);
                }
                else {
                    reject(xhr.statusText);
                }
            }
        }
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
    });
};
