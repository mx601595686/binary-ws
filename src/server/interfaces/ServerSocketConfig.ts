import { CertMeta } from "ws";
import { BaseSocketConfig } from "../../BaseSocket/interfaces/BaseSocketConfig";

// 注意：这里面的参数都是供‘WS’使用的，BaseSocketConfig中定义的参数不要与WS使用的参数相互冲突了

/**
 * 服务器端socket 接口构造函数参数。    
 * 
 * @export
 * @interface ServerSocketConfig
 * @extends {BaseSocketConfig}
 */
export interface ServerSocketConfig extends BaseSocketConfig {

    /**
     *  An object with custom headers to send along with the request.
     */
    headers?: { [key: string]: string };

    /**
     * The certificate key.
     */
    cert?: CertMeta;

    /**
     * The private key.
     */
    key?: CertMeta;

    /**
     * The private key, certificate, and CA certs.
     */
    pfx?: string | Buffer;

    /**
     *  Trusted certificates.
     */
    ca?: CertMeta;
}