import * as crypto from "crypto";
import axios from "axios";
import * as querystring from "querystring";

interface Param {
  com: string;
  num: string;
  phone?: string;
  from?: string;
  to?: string;
  resultv2?: 0 | 1;
  show?: "json" | "xml" | "html" | "text";
  order?: "desc" | "asc";
}

export default class {
  private key: string;

  private customer: string;

  constructor(key: string, customer: string) {
    this.key = key;
    this.customer = customer;
  }

  query(
    com: Param["com"],
    num: Param["num"],
    options: {
      phone?: Param["phone"];
      from?: Param["from"];
      to?: Param["to"];
      resultv2?: Param["resultv2"];
      show?: Param["show"];
      order?: Param["order"];
    } = {}
  ) {
    const { customer } = this;
    const { phone, from, to, resultv2, order } = options;
    let show: 0 | 1 | 2 | 3;
    switch (options.show) {
      case "xml":
        show = 1;
        break;
      case "html":
        show = 2;
        break;
      case "text":
        show = 3;
        break;
      case "json":
      default:
        show = 0;
        break;
    }
    const paramData = { com, num, phone, from, to, resultv2, show, order };
    Object.entries(paramData).forEach(res => {
      const [k, v] = res as [keyof Param, any];
      if (!v) delete paramData[k];
    });
    const param = JSON.stringify(paramData);
    const sign = crypto
      .createHash("md5")
      .update(`${param}${this.key}${customer}`)
      .digest("hex")
      .toUpperCase();
    return axios.post(
      "https://poll.kuaidi100.com/poll/query.do",
      querystring.stringify({ customer, sign, param })
    );
  }
}
