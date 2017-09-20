/// <reference types="node" />
import { BaseSocketConfig } from './../common/BaseSocketConfig';
import { BaseSocket } from "../common/BaseSocket";
export declare class Socket extends BaseSocket {
    readonly socket: WebSocket;
    /**
     * @param {string} [url] 服务器地址，如果不指定，默认连接的是当前域名下的根
     */
    constructor(url?: string);
    /**
     * @param  {BaseSocketConfig} [configs] 端口的配置
     */
    constructor(configs?: BaseSocketConfig);
    /**
     * 浏览器版除了可以直接发送Buffer之外还可以直接发送ArrayBuffer、TypedBuffer、DataView、Blob
     */
    send(messageName: string, data?: any[] | Buffer, needACK?: boolean, prior?: boolean): Promise<void> & {
        messageID: number;
    };
    private _transformType(data);
    protected _sendData(data: Buffer): Promise<void>;
    close(): void;
}
