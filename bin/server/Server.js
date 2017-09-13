"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WS = require("ws");
const events = require("events");
const http = require("http");
const https = require("https");
const Socket_1 = require("./Socket");
class Server extends events.EventEmitter {
    constructor(...args) {
        super();
        /**
         * 保存所有客户端连接。key是socket.id
         */
        this.clients = new Map();
        const config = {
            host: '0.0.0.0',
            port: 8080,
            maxPayload: 1024 * 1024 * 10,
            verifyClient: (info, cb) => {
                this.verifyClient(info.req, info.origin, info.secure).then(cb);
            },
            clientTracking: false,
        };
        if (args[0] instanceof http.Server || args[0] instanceof https.Server) {
            config.server = args[0];
        }
        else if (typeof args[0] === 'string') {
            config.host = args[0];
            if (typeof args[1] === 'number')
                config.port = args[1];
        }
        else if (typeof args[0] === 'object') {
            Object.assign(config, args[0]);
            config.maxPayload = config.maxPayload < 1024 ? 1024 : config.maxPayload;
        }
        this._ws = new WS.Server(config);
        this._ws.on('error', this.emit.bind(this, 'error'));
        this._ws.on('listening', this.emit.bind(this, 'listening'));
        this._ws.on('connection', (client) => {
            const socket = new Socket_1.Socket(client);
            this.clients.set(socket.id, socket);
            this.emit('connection', socket);
            socket.on('close', () => {
                this.clients.delete(socket.id);
            });
        });
    }
    /**
     * 判断是否接受新的连接
     *
     * @param {string} origin The value in the Origin header indicated by the client.
     * @param {boolean} secure 'true' if req.connection.authorized or req.connection.encrypted is set.
     * @param {http.IncomingMessage} req The client HTTP GET request.
     * @returns {Promise<boolean>}
     * @memberof Server
     */
    verifyClient(req, origin, secure) {
        return Promise.resolve(true);
    }
    /**
     * 关闭服务器，并断开所有的客户端连接
     *
     * @returns {void}
     * @memberof Server
     */
    close() {
        this._ws.close(err => {
            this.emit('close', err);
        });
    }
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
    addListener(event, listener) {
        super.addListener(event, listener);
        return this;
    }
    once(event, listener) {
        super.once(event, listener);
        return this;
    }
}
exports.Server = Server;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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Q0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxZQUFZLENBQUMsR0FBeUIsRUFBRSxNQUFjLEVBQUUsTUFBZTtRQUNuRSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRztZQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQVlELEVBQUUsQ0FBQyxLQUFhLEVBQUUsUUFBa0I7UUFDaEMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBWUQsV0FBVyxDQUFDLEtBQWEsRUFBRSxRQUFrQjtRQUN6QyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFZRCxJQUFJLENBQUMsS0FBYSxFQUFFLFFBQWtCO1FBQ2xDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBOUpELHdCQThKQyIsImZpbGUiOiJzZXJ2ZXIvU2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgV1MgZnJvbSAnd3MnO1xyXG5pbXBvcnQgKiBhcyBldmVudHMgZnJvbSAnZXZlbnRzJztcclxuaW1wb3J0ICogYXMgaHR0cCBmcm9tICdodHRwJztcclxuaW1wb3J0ICogYXMgaHR0cHMgZnJvbSAnaHR0cHMnO1xyXG5pbXBvcnQgeyBTZXJ2ZXJDb25maWcgfSBmcm9tICcuL1NlcnZlckNvbmZpZyc7XHJcbmltcG9ydCB7IFNvY2tldCB9IGZyb20gJy4vU29ja2V0JztcclxuXHJcbmV4cG9ydCBjbGFzcyBTZXJ2ZXIgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOiiq+WMheijheeahHdlYnNvY2tldOWvueixoVxyXG4gICAgICogXHJcbiAgICAgKiBAdHlwZSB7V1MuU2VydmVyfVxyXG4gICAgICogQG1lbWJlcm9mIFNlcnZlclxyXG4gICAgICovXHJcbiAgICByZWFkb25seSBfd3M6IFdTLlNlcnZlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOS/neWtmOaJgOacieWuouaIt+err+i/nuaOpeOAgmtleeaYr3NvY2tldC5pZFxyXG4gICAgICovXHJcbiAgICByZWFkb25seSBjbGllbnRzOiBNYXA8bnVtYmVyLCBTb2NrZXQ+ID0gbmV3IE1hcCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu6d2Vic29ja2V05pyN5Yqh5Zmo44CCXHJcbiAgICAgKiBAbWVtYmVyb2YgU2VydmVyXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKClcclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu6d2Vic29ja2V05pyN5Yqh5Zmo44CCXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaG9zdCDnm5HlkKznmoTlnLDlnYBcclxuICAgICAqIEBtZW1iZXJvZiBTZXJ2ZXJcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoaG9zdDogc3RyaW5nKVxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7p3ZWJzb2NrZXTmnI3liqHlmajjgIJcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwb3J0IOebkeWQrOeahOerr+WPo1xyXG4gICAgICogQG1lbWJlcm9mIFNlcnZlclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihwb3J0OiBudW1iZXIpXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7undlYnNvY2tldOacjeWKoeWZqOOAglxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGhvc3Qg55uR5ZCs55qE5Zyw5Z2AXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9ydCDnm5HlkKznmoTnq6/lj6NcclxuICAgICAqIEBtZW1iZXJvZiBTZXJ2ZXJcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoaG9zdDogc3RyaW5nLCBwb3J0OiBudW1iZXIpXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7undlYnNvY2tldOacjeWKoeWZqOOAglxyXG4gICAgICogQHBhcmFtIHsoaHR0cC5TZXJ2ZXIgfCBodHRwcy5TZXJ2ZXIpfSBzZXJ2ZXIg57uR5a6a5Yiw6L+Z5LiqaHR0cOacjeWKoeWZqOS5i+S4ilxyXG4gICAgICogQG1lbWJlcm9mIFNlcnZlclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihzZXJ2ZXI6IGh0dHAuU2VydmVyIHwgaHR0cHMuU2VydmVyKVxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7p3ZWJzb2NrZXTmnI3liqHlmajjgIJcclxuICAgICAqIEBwYXJhbSB7U2VydmVyQ29uZmlnfSBvcHRpb25zIOacjeWKoeWZqOmFjee9rlxyXG4gICAgICogQG1lbWJlcm9mIFNlcnZlclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBTZXJ2ZXJDb25maWcpXHJcbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmZpZzogU2VydmVyQ29uZmlnIHwgYW55ID0ge1xyXG4gICAgICAgICAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICAgICAgICAgIHBvcnQ6IDgwODAsXHJcbiAgICAgICAgICAgIG1heFBheWxvYWQ6IDEwMjQgKiAxMDI0ICogMTAsXHJcbiAgICAgICAgICAgIHZlcmlmeUNsaWVudDogKGluZm86IGFueSwgY2I6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJpZnlDbGllbnQoaW5mby5yZXEsIGluZm8ub3JpZ2luLCBpbmZvLnNlY3VyZSkudGhlbihjYik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNsaWVudFRyYWNraW5nOiBmYWxzZSwgIC8vV1PkuI3lnKhzZXJ2ZXIuY2xpZW50c+S4reS/neWtmOWuouaIt+err+i/nuaOpVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChhcmdzWzBdIGluc3RhbmNlb2YgKDxhbnk+aHR0cCkuU2VydmVyIHx8IGFyZ3NbMF0gaW5zdGFuY2VvZiAoPGFueT5odHRwcykuU2VydmVyKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZy5zZXJ2ZXIgPSBhcmdzWzBdO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFyZ3NbMF0gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZy5ob3N0ID0gYXJnc1swXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmdzWzFdID09PSAnbnVtYmVyJylcclxuICAgICAgICAgICAgICAgIGNvbmZpZy5wb3J0ID0gYXJnc1sxXTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKGNvbmZpZywgYXJnc1swXSk7XHJcbiAgICAgICAgICAgIGNvbmZpZy5tYXhQYXlsb2FkID0gY29uZmlnLm1heFBheWxvYWQgPCAxMDI0ID8gMTAyNCA6IGNvbmZpZy5tYXhQYXlsb2FkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fd3MgPSBuZXcgV1MuU2VydmVyKGNvbmZpZyk7XHJcbiAgICAgICAgdGhpcy5fd3Mub24oJ2Vycm9yJywgdGhpcy5lbWl0LmJpbmQodGhpcywgJ2Vycm9yJykpO1xyXG4gICAgICAgIHRoaXMuX3dzLm9uKCdsaXN0ZW5pbmcnLCB0aGlzLmVtaXQuYmluZCh0aGlzLCAnbGlzdGVuaW5nJykpO1xyXG4gICAgICAgIHRoaXMuX3dzLm9uKCdjb25uZWN0aW9uJywgKGNsaWVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzb2NrZXQgPSBuZXcgU29ja2V0KGNsaWVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50cy5zZXQoc29ja2V0LmlkLCBzb2NrZXQpO1xyXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2Nvbm5lY3Rpb24nLCBzb2NrZXQpO1xyXG5cclxuICAgICAgICAgICAgc29ja2V0Lm9uKCdjbG9zZScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50cy5kZWxldGUoc29ja2V0LmlkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3mmK/lkKbmjqXlj5fmlrDnmoTov57mjqVcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG9yaWdpbiBUaGUgdmFsdWUgaW4gdGhlIE9yaWdpbiBoZWFkZXIgaW5kaWNhdGVkIGJ5IHRoZSBjbGllbnQuXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHNlY3VyZSAndHJ1ZScgaWYgcmVxLmNvbm5lY3Rpb24uYXV0aG9yaXplZCBvciByZXEuY29ubmVjdGlvbi5lbmNyeXB0ZWQgaXMgc2V0LlxyXG4gICAgICogQHBhcmFtIHtodHRwLkluY29taW5nTWVzc2FnZX0gcmVxIFRoZSBjbGllbnQgSFRUUCBHRVQgcmVxdWVzdC5cclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGJvb2xlYW4+fSBcclxuICAgICAqIEBtZW1iZXJvZiBTZXJ2ZXJcclxuICAgICAqL1xyXG4gICAgdmVyaWZ5Q2xpZW50KHJlcTogaHR0cC5JbmNvbWluZ01lc3NhZ2UsIG9yaWdpbjogc3RyaW5nLCBzZWN1cmU6IGJvb2xlYW4pOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YWz6Zet5pyN5Yqh5Zmo77yM5bm25pat5byA5omA5pyJ55qE5a6i5oi356uv6L+e5o6lXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIHt2b2lkfSBcclxuICAgICAqIEBtZW1iZXJvZiBTZXJ2ZXJcclxuICAgICAqL1xyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgdGhpcy5fd3MuY2xvc2UoZXJyID0+IHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0KCdjbG9zZScsIGVycik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb24oZXZlbnQ6ICdlcnJvcicsIGNiOiAoZXJyOiBFcnJvcikgPT4gdm9pZCk6IHRoaXNcclxuICAgIC8qKlxyXG4gICAgICog5b2T5pyN5Yqh5Zmo5byA5aeL55uR5ZCsXHJcbiAgICAgKi9cclxuICAgIG9uKGV2ZW50OiAnbGlzdGVuaW5nJywgY2I6ICgpID0+IHZvaWQpOiB0aGlzXHJcbiAgICAvKipcclxuICAgICAqIOW9k+acieaWsOeahOWuouaIt+err+S4juacjeWKoeWZqOW7uueri+i1t+i/nuaOpVxyXG4gICAgICovXHJcbiAgICBvbihldmVudDogJ2Nvbm5lY3Rpb24nLCBjYjogKHNvY2tldDogU29ja2V0KSA9PiB2b2lkKTogdGhpc1xyXG4gICAgb24oZXZlbnQ6ICdjbG9zZScsIGNiOiAoZXJyOiBFcnJvcikgPT4gdm9pZCk6IHRoaXNcclxuICAgIG9uKGV2ZW50OiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbik6IHRoaXMge1xyXG4gICAgICAgIHN1cGVyLm9uKGV2ZW50LCBsaXN0ZW5lcik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTGlzdGVuZXIoZXZlbnQ6ICdlcnJvcicsIGNiOiAoZXJyOiBFcnJvcikgPT4gdm9pZCk6IHRoaXNcclxuICAgIC8qKlxyXG4gICAgICog5b2T5pyN5Yqh5Zmo5byA5aeL55uR5ZCsXHJcbiAgICAgKi9cclxuICAgIGFkZExpc3RlbmVyKGV2ZW50OiAnbGlzdGVuaW5nJywgY2I6ICgpID0+IHZvaWQpOiB0aGlzXHJcbiAgICAvKipcclxuICAgICAqIOW9k+acieaWsOeahOWuouaIt+err+S4juacjeWKoeWZqOW7uueri+i1t+i/nuaOpVxyXG4gICAgICovXHJcbiAgICBhZGRMaXN0ZW5lcihldmVudDogJ2Nvbm5lY3Rpb24nLCBjYjogKHNvY2tldDogU29ja2V0KSA9PiB2b2lkKTogdGhpc1xyXG4gICAgYWRkTGlzdGVuZXIoZXZlbnQ6ICdjbG9zZScsIGNiOiAoZXJyOiBFcnJvcikgPT4gdm9pZCk6IHRoaXNcclxuICAgIGFkZExpc3RlbmVyKGV2ZW50OiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbik6IHRoaXMge1xyXG4gICAgICAgIHN1cGVyLmFkZExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgb25jZShldmVudDogJ2Vycm9yJywgY2I6IChlcnI6IEVycm9yKSA9PiB2b2lkKTogdGhpc1xyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPmnI3liqHlmajlvIDlp4vnm5HlkKxcclxuICAgICAqL1xyXG4gICAgb25jZShldmVudDogJ2xpc3RlbmluZycsIGNiOiAoKSA9PiB2b2lkKTogdGhpc1xyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPmnInmlrDnmoTlrqLmiLfnq6/kuI7mnI3liqHlmajlu7rnq4votbfov57mjqVcclxuICAgICAqL1xyXG4gICAgb25jZShldmVudDogJ2Nvbm5lY3Rpb24nLCBjYjogKHNvY2tldDogU29ja2V0KSA9PiB2b2lkKTogdGhpc1xyXG4gICAgb25jZShldmVudDogJ2Nsb3NlJywgY2I6IChlcnI6IEVycm9yKSA9PiB2b2lkKTogdGhpc1xyXG4gICAgb25jZShldmVudDogc3RyaW5nLCBsaXN0ZW5lcjogRnVuY3Rpb24pOiB0aGlzIHtcclxuICAgICAgICBzdXBlci5vbmNlKGV2ZW50LCBsaXN0ZW5lcik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn0iXX0=
