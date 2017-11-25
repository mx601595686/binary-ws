"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Emitter = require("component-emitter");
/**
 * websocket 接口的抽象类，定义了需要实现的基础功能
 */
class BaseSocket extends Emitter {
    constructor(socket, configs) {
        super();
        /**
         * _messageID 的ID号，id从0开始。每发一条消息，该id加1。
         */
        this._messageID = 0;
        /**
         * 消息的发送队列。如果要取消发送，可以向send中传递以error
         */
        this._sendingQueue = new Map();
        this.id = BaseSocket._id_Number++;
        this._socket = socket;
        this.url = configs.url;
        this.maxPayload = configs.maxPayload == null || configs.maxPayload <= 0 ? 0 : configs.maxPayload + 4;
        this.once('close', () => {
            for (let item of [...this._sendingQueue.keys()].reverse())
                this.cancel(item, new Error('连接中断'));
        });
    }
    /**
     * 连接的当前状态
     */
    get readyState() {
        return this._socket.readyState;
    }
    /**
     * 在缓冲队列中等待发送的数据大小
     */
    get bufferedAmount() {
        let size = 0;
        for (let item of this._sendingQueue.values()) {
            size += item.size;
        }
        return size;
    }
    /**
     * 发送消息。(返回的promise中包含该条消息的messageID)
     * @param title 消息的标题
     * @param data 携带的数据
     */
    send(title, data) {
        const messageID = this._messageID++;
        const result = new Promise((resolve, reject) => {
            const b_title = Buffer.from(title);
            const b_title_length = Buffer.alloc(4);
            b_title_length.writeUInt32BE(b_title.length, 0);
            const r_data = Buffer.concat([b_title_length, b_title, data]);
            if (this.maxPayload !== 0 && r_data.length > this.maxPayload)
                throw new Error('发送的消息大小超出了限制');
            let sent = false; //是否已经执行send了
            const send = (err) => {
                if (sent)
                    return;
                else
                    sent = true;
                if (err !== undefined) {
                    reject(err);
                    this._sendingQueue.delete(messageID);
                }
                else {
                    this._sendData(r_data).then(() => {
                        this._sendingQueue.delete(messageID);
                        resolve();
                    }).catch((err) => {
                        this._sendingQueue.delete(messageID);
                        reject(err);
                    }).then(() => {
                        if (this._sendingQueue.size > 0)
                            this._sendingQueue.values().next().value.send();
                    });
                }
            };
            this._sendingQueue.set(messageID, { size: r_data.length, send });
            if (this._sendingQueue.size === 1)
                send(); //如果没有消息排队就直接发送
        });
        result.messageID = messageID;
        return result;
    }
    /**
     * 取消发送
     * @param messageID 要取消发送消息的messageID
     * @param err 传递一个error，指示取消的原因
     */
    cancel(messageID, err = new Error('发送取消')) {
        const item = this._sendingQueue.get(messageID);
        if (item != null)
            item.send(err);
    }
    /**
     * 解析接收到数据。子类接收到消息后需要触发这个方法
     *
     * @param data 接收到数据
     */
    _receiveData(data) {
        try {
            let offset = 0;
            const title_length = data.readUInt32BE(0);
            offset += 4;
            const title = data.slice(offset, offset += title_length).toString();
            const r_data = data.slice(offset);
            this.emit('message', title, r_data);
        }
        catch (error) {
            this.emit('error', error);
        }
    }
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
    once(event, listener) {
        super.once(event, listener);
        return this;
    }
}
/**
 * 每新建一个接口+1
 */
BaseSocket._id_Number = 0;
exports.BaseSocket = BaseSocket;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2VTb2NrZXQvY2xhc3Nlcy9CYXNlU29ja2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQTZDO0FBTTdDOztHQUVHO0FBQ0gsZ0JBQWlDLFNBQVEsT0FBTztJQW1ENUMsWUFBWSxNQUFzQixFQUFFLE9BQXlCO1FBQ3pELEtBQUssRUFBRSxDQUFDO1FBN0NaOztXQUVHO1FBQ0ssZUFBVSxHQUFHLENBQUMsQ0FBQztRQUV2Qjs7V0FFRztRQUNjLGtCQUFhLEdBQStELElBQUksR0FBRyxFQUFFLENBQUM7UUF1Q25HLElBQUksQ0FBQyxFQUFFLEdBQUcsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxVQUFVLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUVyRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNmLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3RELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBaENEOztPQUVHO0lBQ0gsSUFBSSxVQUFVO1FBQ1YsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO0lBQ25DLENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksY0FBYztRQUNkLElBQUksSUFBSSxHQUFHLENBQUMs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Q0FBQztRQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7O0FBOUtEOztHQUVHO0FBQ1kscUJBQVUsR0FBRyxDQUFDLENBQUM7QUFMbEMsZ0NBaUxDIiwiZmlsZSI6IkJhc2VTb2NrZXQvY2xhc3Nlcy9CYXNlU29ja2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgRW1pdHRlciBmcm9tICdjb21wb25lbnQtZW1pdHRlcic7XHJcbmltcG9ydCAqIGFzIFdTIGZyb20gJ3dzJztcclxuXHJcbmltcG9ydCB7IFJlYWR5U3RhdGUgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9SZWFkeVN0YXRlXCI7XHJcbmltcG9ydCB7IEJhc2VTb2NrZXRDb25maWcgfSBmcm9tICcuLi9pbnRlcmZhY2VzL0Jhc2VTb2NrZXRDb25maWcnO1xyXG5cclxuLyoqXHJcbiAqIHdlYnNvY2tldCDmjqXlj6PnmoTmir3osaHnsbvvvIzlrprkuYnkuobpnIDopoHlrp7njrDnmoTln7rnoYDlip/og71cclxuICovXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlU29ja2V0IGV4dGVuZHMgRW1pdHRlciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmr4/mlrDlu7rkuIDkuKrmjqXlj6MrMVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfaWRfTnVtYmVyID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIF9tZXNzYWdlSUQg55qESUTlj7fvvIxpZOS7jjDlvIDlp4vjgILmr4/lj5HkuIDmnaHmtojmga/vvIzor6VpZOWKoDHjgIJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfbWVzc2FnZUlEID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOa2iOaBr+eahOWPkemAgemYn+WIl+OAguWmguaenOimgeWPlua2iOWPkemAge+8jOWPr+S7peWQkXNlbmTkuK3kvKDpgJLku6VlcnJvclxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zZW5kaW5nUXVldWU6IE1hcDxudW1iZXIsIHsgc2l6ZTogbnVtYmVyLCBzZW5kOiAoZXJyPzogRXJyb3IpID0+IHZvaWQgfT4gPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkv53lrZjooqvljIXoo4XnmoRzb2NrZXTlr7nosaFcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IF9zb2NrZXQ6IFdlYlNvY2tldCB8IFdTO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5b2T5YmN5o6l5Y+j55qEaWRcclxuICAgICAqL1xyXG4gICAgcmVhZG9ubHkgaWQ6IG51bWJlcjtcclxuXHJcbiAgICByZWFkb25seSB1cmw6IHN0cmluZztcclxuXHJcbiAgICByZWFkb25seSBtYXhQYXlsb2FkOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDov57mjqXnmoTlvZPliY3nirbmgIFcclxuICAgICAqL1xyXG4gICAgZ2V0IHJlYWR5U3RhdGUoKTogUmVhZHlTdGF0ZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvY2tldC5yZWFkeVN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Zyo57yT5Yay6Zif5YiX5Lit562J5b6F5Y+R6YCB55qE5pWw5o2u5aSn5bCPXHJcbiAgICAgKi9cclxuICAgIGdldCBidWZmZXJlZEFtb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBzaXplID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLl9zZW5kaW5nUXVldWUudmFsdWVzKCkpIHtcclxuICAgICAgICAgICAgc2l6ZSArPSBpdGVtLnNpemU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihzb2NrZXQ6IFdlYlNvY2tldCB8IFdTLCBjb25maWdzOiBCYXNlU29ja2V0Q29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5pZCA9IEJhc2VTb2NrZXQuX2lkX051bWJlcisrO1xyXG4gICAgICAgIHRoaXMuX3NvY2tldCA9IHNvY2tldDtcclxuICAgICAgICB0aGlzLnVybCA9IGNvbmZpZ3MudXJsO1xyXG4gICAgICAgIHRoaXMubWF4UGF5bG9hZCA9IGNvbmZpZ3MubWF4UGF5bG9hZCA9PSBudWxsIHx8IGNvbmZpZ3MubWF4UGF5bG9hZCA8PSAwID8gMCA6IGNvbmZpZ3MubWF4UGF5bG9hZCArIDQ7XHJcblxyXG4gICAgICAgIHRoaXMub25jZSgnY2xvc2UnLCAoKSA9PiB7ICAgIC8v5aaC5p6c5pat5byA77yM57uI5q2i5omA5pyJ6L+Y5pyq5Y+R6YCB55qE5raI5oGv44CC5LuO5ZCO5ZCR5YmN5Y+W5raIXHJcbiAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgWy4uLnRoaXMuX3NlbmRpbmdRdWV1ZS5rZXlzKCldLnJldmVyc2UoKSlcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FuY2VsKGl0ZW0sIG5ldyBFcnJvcign6L+e5o6l5Lit5patJykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6ZyA6KaB5a2Q57G76KaG5YaZ44CC55So5LqO5Y+R6YCB5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBhc3luYyBfc2VuZERhdGEoZGF0YTogQnVmZmVyKTogUHJvbWlzZTx2b2lkPjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWFs+mXreaOpeWPo+OAguWFs+mXreS5i+WQjuS8muinpuWPkWNsb3Nl5LqL5Lu2XHJcbiAgICAgKi9cclxuICAgIGFic3RyYWN0IGNsb3NlKCk6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlj5HpgIHmtojmga/jgIIo6L+U5Zue55qEcHJvbWlzZeS4reWMheWQq+ivpeadoea2iOaBr+eahG1lc3NhZ2VJRClcclxuICAgICAqIEBwYXJhbSB0aXRsZSDmtojmga/nmoTmoIfpophcclxuICAgICAqIEBwYXJhbSBkYXRhIOaQuuW4pueahOaVsOaNrlxyXG4gICAgICovXHJcbiAgICBzZW5kKHRpdGxlOiBzdHJpbmcsIGRhdGE6IEJ1ZmZlcik6IFByb21pc2U8dm9pZD4gJiB7IG1lc3NhZ2VJRDogbnVtYmVyIH0ge1xyXG4gICAgICAgIGNvbnN0IG1lc3NhZ2VJRCA9IHRoaXMuX21lc3NhZ2VJRCsrO1xyXG5cclxuICAgICAgICBjb25zdCByZXN1bHQ6IGFueSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYl90aXRsZSA9IEJ1ZmZlci5mcm9tKHRpdGxlKTtcclxuICAgICAgICAgICAgY29uc3QgYl90aXRsZV9sZW5ndGggPSBCdWZmZXIuYWxsb2MoNCk7XHJcbiAgICAgICAgICAgIGJfdGl0bGVfbGVuZ3RoLndyaXRlVUludDMyQkUoYl90aXRsZS5sZW5ndGgsIDApO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgcl9kYXRhID0gQnVmZmVyLmNvbmNhdChbYl90aXRsZV9sZW5ndGgsIGJfdGl0bGUsIGRhdGFdKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1heFBheWxvYWQgIT09IDAgJiYgcl9kYXRhLmxlbmd0aCA+IHRoaXMubWF4UGF5bG9hZClcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcign5Y+R6YCB55qE5raI5oGv5aSn5bCP6LaF5Ye65LqG6ZmQ5Yi2Jyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2VudCA9IGZhbHNlOyAgIC8v5piv5ZCm5bey57uP5omn6KGMc2VuZOS6hlxyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2VuZCA9IChlcnI/OiBFcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbnQpIHJldHVybjsgZWxzZSBzZW50ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZW5kaW5nUXVldWUuZGVsZXRlKG1lc3NhZ2VJRCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbmREYXRhKHJfZGF0YSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbmRpbmdRdWV1ZS5kZWxldGUobWVzc2FnZUlEKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VuZGluZ1F1ZXVlLmRlbGV0ZShtZXNzYWdlSUQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NlbmRpbmdRdWV1ZS5zaXplID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbmRpbmdRdWV1ZS52YWx1ZXMoKS5uZXh0KCkudmFsdWUuc2VuZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9zZW5kaW5nUXVldWUuc2V0KG1lc3NhZ2VJRCwgeyBzaXplOiByX2RhdGEubGVuZ3RoLCBzZW5kIH0pO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2VuZGluZ1F1ZXVlLnNpemUgPT09IDEpIHNlbmQoKTsgIC8v5aaC5p6c5rKh5pyJ5raI5oGv5o6S6Zif5bCx55u05o6l5Y+R6YCBXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJlc3VsdC5tZXNzYWdlSUQgPSBtZXNzYWdlSUQ7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWPlua2iOWPkemAgVxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2VJRCDopoHlj5bmtojlj5HpgIHmtojmga/nmoRtZXNzYWdlSURcclxuICAgICAqIEBwYXJhbSBlcnIg5Lyg6YCS5LiA5LiqZXJyb3LvvIzmjIfnpLrlj5bmtojnmoTljp/lm6BcclxuICAgICAqL1xyXG4gICAgY2FuY2VsKG1lc3NhZ2VJRDogbnVtYmVyLCBlcnI6IEVycm9yID0gbmV3IEVycm9yKCflj5HpgIHlj5bmtognKSkge1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl9zZW5kaW5nUXVldWUuZ2V0KG1lc3NhZ2VJRCk7XHJcbiAgICAgICAgaWYgKGl0ZW0gIT0gbnVsbCkgaXRlbS5zZW5kKGVycik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDop6PmnpDmjqXmlLbliLDmlbDmja7jgILlrZDnsbvmjqXmlLbliLDmtojmga/lkI7pnIDopoHop6blj5Hov5nkuKrmlrnms5VcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGRhdGEg5o6l5pS25Yiw5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBfcmVjZWl2ZURhdGEoZGF0YTogQnVmZmVyKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IG9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlX2xlbmd0aCA9IGRhdGEucmVhZFVJbnQzMkJFKDApOyBvZmZzZXQgKz0gNDtcclxuICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBkYXRhLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICs9IHRpdGxlX2xlbmd0aCkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgY29uc3Qgcl9kYXRhID0gZGF0YS5zbGljZShvZmZzZXQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lbWl0KCdtZXNzYWdlJywgdGl0bGUsIHJfZGF0YSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb24oZXZlbnQ6ICdlcnJvcicsIGxpc3RlbmVyOiAoZXJyOiBFcnJvcikgPT4gdm9pZCk6IHRoaXNcclxuICAgIC8qKlxyXG4gICAgICog5b2T5pS25Yiw5raI5oGvXHJcbiAgICAgKi9cclxuICAgIG9uKGV2ZW50OiAnbWVzc2FnZScsIGxpc3RlbmVyOiAodGl0bGU6IHN0cmluZywgZGF0YTogQnVmZmVyKSA9PiB2b2lkKTogdGhpc1xyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPov57mjqXlu7rnq4tcclxuICAgICAqL1xyXG4gICAgb24oZXZlbnQ6ICdvcGVuJywgbGlzdGVuZXI6ICgpID0+IHZvaWQpOiB0aGlzXHJcbiAgICAvKipcclxuICAgICAqIOaWreW8gOi/nuaOpVxyXG4gICAgICovXHJcbiAgICBvbihldmVudDogJ2Nsb3NlJywgbGlzdGVuZXI6IChjb2RlOiBudW1iZXIsIHJlYXNvbjogc3RyaW5nKSA9PiB2b2lkKTogdGhpc1xyXG4gICAgb24oZXZlbnQ6IHN0cmluZywgbGlzdGVuZXI6IEZ1bmN0aW9uKTogdGhpcyB7XHJcbiAgICAgICAgc3VwZXIub24oZXZlbnQsIGxpc3RlbmVyKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBvbmNlKGV2ZW50OiAnZXJyb3InLCBsaXN0ZW5lcjogKGVycjogRXJyb3IpID0+IHZvaWQpOiB0aGlzXHJcbiAgICBvbmNlKGV2ZW50OiAnbWVzc2FnZScsIGxpc3RlbmVyOiAodGl0bGU6IHN0cmluZywgZGF0YTogQnVmZmVyKSA9PiB2b2lkKTogdGhpc1xyXG4gICAgb25jZShldmVudDogJ29wZW4nLCBsaXN0ZW5lcjogKCkgPT4gdm9pZCk6IHRoaXNcclxuICAgIG9uY2UoZXZlbnQ6ICdjbG9zZScsIGxpc3RlbmVyOiAoY29kZTogbnVtYmVyLCByZWFzb246IHN0cmluZykgPT4gdm9pZCk6IHRoaXNcclxuICAgIG9uY2UoZXZlbnQ6IHN0cmluZywgbGlzdGVuZXI6IEZ1bmN0aW9uKTogdGhpcyB7XHJcbiAgICAgICAgc3VwZXIub25jZShldmVudCwgbGlzdGVuZXIpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59Il19
