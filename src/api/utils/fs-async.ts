import * as fs from 'fs';

type ReadFileOptions = {
    encoding?: string;
    flag?: string
};

type ReadDirOptions = {
    encoding: BufferEncoding;
    withFileTypes?: false;
} | 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'latin1' | 'binary' | 'hex';

export async function readFileAsync(path: fs.PathLike, options?: ReadFileOptions): Promise<Buffer> {
    return new Promise<Buffer>((resolve: Resolve<Buffer>, reject: Reject) => {
        fs.readFile(path, options, (err:NodeJS.ErrnoException, data: Buffer) => {
            if(err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}

export async function readDirAsync(path: fs.PathLike, options?:ReadDirOptions): Promise<string[]> {
    return new Promise<string[]>((resolve: Resolve<string[]>, reject: Reject) => {
        fs.readdir(path, options, (err: NodeJS.ErrnoException, files: string[]) => {
            if(err) {
                reject(err);
                return;
            }
            resolve(files);
        });
    });
}

export async function lstatAsync(path: fs.PathLike): Promise<fs.Stats> {
    return new Promise<fs.Stats>((resolve: Resolve<fs.Stats>, reject: Reject) => {
        fs.lstat(path, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(stats);
        });
    });
}

export async function existsAsync(path: fs.PathLike): Promise<boolean> {
    return new Promise<boolean>((resolve: Resolve<boolean>) => {
        fs.exists(path, (exists: boolean) => resolve(exists));
    });
}
