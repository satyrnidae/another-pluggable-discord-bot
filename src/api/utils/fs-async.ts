import * as fs from 'fs';

/**
 * Contains utility functions for promisified file system access
 */
export namespace FsAsync {
    /**
     * Asynchrounously reads the contents of a file. Promisifies fs.readFile from the fs package.
     * @param path The path of the file to read
     * @param options Read options for the file
     */
    export async function readFileAsync(path: fs.PathLike, options?: ReadFileOptions): Promise<Buffer> {
        return new Promise<Buffer>((resolve: Resolve<Buffer>, reject: Reject) => {
            fs.readFile(path, options, (err: NodeJS.ErrnoException, data: Buffer) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    }

    /**
     * Asynchronously gathers a listing for the specified directory. Promisifies fs.readFile from the fs package.
     * @param path The path of the directory to list
     * @param options Read options for the directory
     */
    export async function readDirAsync(path: fs.PathLike, options?: ReadDirOptions): Promise<string[]> {
        return new Promise<string[]>((resolve: Resolve<string[]>, reject: Reject) => {
            fs.readdir(path, options, (err: NodeJS.ErrnoException, files: string[]) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(files);
            });
        });
    }

    /**
     * Asynchronously returns the stats of a file. Promisifies fs.lstat.
     * @param path The path of the file to stat
     */
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

    /**
     * Asynchronously checks if a file or directory exists. Promisifies fs.exists.
     * @param path The path of the file or directory.
     */
    export async function existsAsync(path: fs.PathLike): Promise<boolean> {
        return new Promise<boolean>((resolve: Resolve<boolean>) => {
            fs.exists(path, (exists: boolean) => resolve(exists));
        });
    }
}
