"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isBuffer = require('is-buffer');
const isBlob = require('is-blob');
const isArrayBuffer = require('is-array-buffer');
const isTypedBuffer = require('is-typedarray');
const blobToBuffer = require('blob-to-buffer');
const typedToBuffer = require('typedarray-to-buffer');
const toArrayBuffer = require('to-arraybuffer');
const BaseSocket_1 = require("../common/BaseSocket");
class BinaryWS extends BaseSocket_1.BaseSocket {
    constructor(args) {
        const cf = {
            url: `ws${location.protocol === 'https:' ? 's' : ''}://${location.host}`
        };
        if (typeof args === 'string') {
            cf.url = args;
        }
        else if (typeof args === 'object') {
            Object.assign(cf, args);
        }
        if (!(cf.socket instanceof WebSocket))
            cf.socket = new WebSocket(cf.url);
        (cf.socket).binaryType = 'arraybuffer';
        (cf.socket).onopen = () => this.emit('open');
        (cf.socket).onclose = (ev) => this.emit('close', ev.code, ev.reason);
        (cf.socket).onerror = (err) => { console.error(err), this.emit('error', new Error('连接错误')); };
        (cf.socket).onmessage = (e) => this._receiveData(typedToBuffer(e.data));
        super('browser', cf);
    }
    /**
     * 浏览器版除了可以直接发送Buffer之外还可以直接发送ArrayBuffer、TypedBuffer、Blob
     */
    send(messageName, data, needACK = true) {
        if (Array.isArray(data)) {
            data = data.map(item => {
                if (isBuffer(item)) {
                    return item;
                }
                else if (isBlob(item)) {
                    return blobToBuffer(item);
                }
                else if (isArrayBuffer(item) || isTypedBuffer(item)) {
                    return typedToBuffer(item);
                }
                else {
                    return item;
                }
            });
        }
        else if (isBuffer(data)) {
            data = data;
        }
        else if (isBlob(data)) {
            data = blobToBuffer(data);
        }
        else if (isArrayBuffer(data) || isTypedBuffer(data)) {
            data = typedToBuffer(data);
        }
        return super.send(messageName, data, needACK);
    }
    _sendData(data) {
        return new Promise((resolve, reject) => {
            this.socket.send(toArrayBuffer(data));
            const check = (interval) => {
                setTimeout(() => {
                    if (this.socket.bufferedAmount === 0) {
                        resolve();
                    }
                    else {
                        check(interval >= 2000 ? 2000 : interval * 2); //最慢2秒检查一次
                    }
                }, interval);
            };
            check(10);
        });
    }
    close() {
        this.socket.close();
    }
}
exports.BinaryWS = BinaryWS;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUV0QyxNQUFNLEtBQUssR0FBRyxDQUFDLFFBQWdCO2dCQUMzQixVQUFVLENBQUM7b0JBQ1AsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkMsT0FBTyxFQUFFLENBQUM7b0JBQ2QsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixLQUFLLENBQUMsUUFBUSxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVTtvQkFDN0QsQ0FBQztnQkFDTCxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDakIsQ0FBQyxDQUFBO1lBRUQsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsS0FBSztRQUNELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDeEIsQ0FBQztDQUNKO0FBbEZELDRCQWtGQyIsImZpbGUiOiJicm93c2VyL0JpbmFyeVdTLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaXNCdWZmZXIgPSByZXF1aXJlKCdpcy1idWZmZXInKTtcclxuY29uc3QgaXNCbG9iID0gcmVxdWlyZSgnaXMtYmxvYicpO1xyXG5jb25zdCBpc0FycmF5QnVmZmVyID0gcmVxdWlyZSgnaXMtYXJyYXktYnVmZmVyJyk7XHJcbmNvbnN0IGlzVHlwZWRCdWZmZXIgPSByZXF1aXJlKCdpcy10eXBlZGFycmF5Jyk7XHJcblxyXG5jb25zdCBibG9iVG9CdWZmZXIgPSByZXF1aXJlKCdibG9iLXRvLWJ1ZmZlcicpO1xyXG5jb25zdCB0eXBlZFRvQnVmZmVyID0gcmVxdWlyZSgndHlwZWRhcnJheS10by1idWZmZXInKTtcclxuY29uc3QgdG9BcnJheUJ1ZmZlciA9IHJlcXVpcmUoJ3RvLWFycmF5YnVmZmVyJyk7XHJcblxyXG5pbXBvcnQgeyBCYXNlU29ja2V0Q29uZmlnIH0gZnJvbSAnLi8uLi9jb21tb24vQmFzZVNvY2tldENvbmZpZyc7XHJcbmltcG9ydCB7IEJhc2VTb2NrZXQgfSBmcm9tIFwiLi4vY29tbW9uL0Jhc2VTb2NrZXRcIjtcclxuaW1wb3J0IHsgUmVhZHlTdGF0ZSB9IGZyb20gXCIuLi9jb21tb24vUmVhZHlTdGF0ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJpbmFyeVdTIGV4dGVuZHMgQmFzZVNvY2tldCB7XHJcblxyXG4gICAgcmVhZG9ubHkgc29ja2V0OiBXZWJTb2NrZXQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3VybF0g5pyN5Yqh5Zmo5Zyw5Z2A77yM5aaC5p6c5LiN5oyH5a6a77yM6buY6K6k6L+e5o6l55qE5piv5b2T5YmN5Z+f5ZCN5LiL55qE5qC5XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHVybD86IHN0cmluZylcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtICB7QmFzZVNvY2tldENvbmZpZ30gW2NvbmZpZ3NdIOerr+WPo+eahOmFjee9rlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWdzPzogQmFzZVNvY2tldENvbmZpZylcclxuICAgIGNvbnN0cnVjdG9yKGFyZ3M/OiBhbnkpIHtcclxuICAgICAgICBjb25zdCBjZjogQmFzZVNvY2tldENvbmZpZyA9IHtcclxuICAgICAgICAgICAgdXJsOiBgd3Mke2xvY2F0aW9uLnByb3RvY29sID09PSAnaHR0cHM6JyA/ICdzJyA6ICcnfTovLyR7bG9jYXRpb24uaG9zdH1gXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGFyZ3MgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGNmLnVybCA9IGFyZ3M7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJncyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihjZiwgYXJncyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIShjZi5zb2NrZXQgaW5zdGFuY2VvZiBXZWJTb2NrZXQpKVxyXG4gICAgICAgICAgICBjZi5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KGNmLnVybCk7XHJcblxyXG4gICAgICAgICg8V2ViU29ja2V0PihjZi5zb2NrZXQpKS5iaW5hcnlUeXBlID0gJ2FycmF5YnVmZmVyJztcclxuICAgICAgICAoPFdlYlNvY2tldD4oY2Yuc29ja2V0KSkub25vcGVuID0gKCkgPT4gdGhpcy5lbWl0KCdvcGVuJyk7XHJcbiAgICAgICAgKDxXZWJTb2NrZXQ+KGNmLnNvY2tldCkpLm9uY2xvc2UgPSAoZXYpID0+IHRoaXMuZW1pdCgnY2xvc2UnLCBldi5jb2RlLCBldi5yZWFzb24pO1xyXG4gICAgICAgICg8V2ViU29ja2V0PihjZi5zb2NrZXQpKS5vbmVycm9yID0gKGVycikgPT4geyBjb25zb2xlLmVycm9yKGVyciksIHRoaXMuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ+i/nuaOpemUmeivrycpKTsgfVxyXG4gICAgICAgICg8V2ViU29ja2V0PihjZi5zb2NrZXQpKS5vbm1lc3NhZ2UgPSAoZSkgPT4gdGhpcy5fcmVjZWl2ZURhdGEodHlwZWRUb0J1ZmZlcihlLmRhdGEpKTtcclxuXHJcbiAgICAgICAgc3VwZXIoJ2Jyb3dzZXInLCBjZik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOa1j+iniOWZqOeJiOmZpOS6huWPr+S7peebtOaOpeWPkemAgUJ1ZmZlcuS5i+Wklui/mOWPr+S7peebtOaOpeWPkemAgUFycmF5QnVmZmVy44CBVHlwZWRCdWZmZXLjgIFCbG9iXHJcbiAgICAgKi9cclxuICAgIHNlbmQobWVzc2FnZU5hbWU6IHN0cmluZywgZGF0YT86IGFueVtdIHwgYW55LCBuZWVkQUNLOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChpc0J1ZmZlcihpdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc0Jsb2IoaXRlbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmxvYlRvQnVmZmVyKGl0ZW0pXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXlCdWZmZXIoaXRlbSkgfHwgaXNUeXBlZEJ1ZmZlcihpdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlZFRvQnVmZmVyKGl0ZW0pXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGlzQnVmZmVyKGRhdGEpKSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNCbG9iKGRhdGEpKSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBibG9iVG9CdWZmZXIoZGF0YSlcclxuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXlCdWZmZXIoZGF0YSkgfHwgaXNUeXBlZEJ1ZmZlcihkYXRhKSkge1xyXG4gICAgICAgICAgICBkYXRhID0gdHlwZWRUb0J1ZmZlcihkYXRhKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNlbmQobWVzc2FnZU5hbWUsIGRhdGEsIG5lZWRBQ0spO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfc2VuZERhdGEoZGF0YTogQnVmZmVyKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZCh0b0FycmF5QnVmZmVyKGRhdGEpKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrID0gKGludGVydmFsOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNvY2tldC5idWZmZXJlZEFtb3VudCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2soaW50ZXJ2YWwgPj0gMjAwMCA/IDIwMDAgOiBpbnRlcnZhbCAqIDIpOyAvL+acgOaFojLnp5Lmo4Dmn6XkuIDmrKFcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCBpbnRlcnZhbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNoZWNrKDEwKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICB0aGlzLnNvY2tldC5jbG9zZSgpO1xyXG4gICAgfVxyXG59Il19
