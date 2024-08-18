var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class D2GFCounter {
  /**
   * コンストラクタ
   *
   * @param type txt2img / img2img
   * @param onChangeCount カウンタ更新時に実行する関数
   */
  constructor(type) {
    __publicField(this, "type");
    __publicField(this, "countArea");
    __publicField(this, "batchArea");
    __publicField(this, "batchCountInput");
    __publicField(this, "batchCountText", "");
    __publicField(this, "count", 0);
    this.type = type;
  }
  createContainer() {
    const app = gradioApp();
    const container = document.createElement("span");
    container.id = `d2gf-count-container_${this.type}`;
    this.countArea = document.createElement("span");
    this.countArea.classList.add("d2gf-count-area");
    this.batchArea = document.createElement("span");
    container.appendChild(this.countArea);
    container.appendChild(this.batchArea);
    this.batchCountInput = app.querySelector(`#${this.type}_batch_count input`);
    return container;
  }
  /**
   * webui の batch count の値を取得して返す
   * 表示欄も更新する
   * 1だったら∞マークにする
   * @returns
   */
  getBatchCount() {
    const batchCountInput = this.batchCountInput;
    if (this.batchArea) {
      this.batchCountText = `${batchCountInput.value === "1" ? "∞" : batchCountInput.value}`;
      this.batchArea.textContent = this.batchCountText;
    }
    return parseInt(batchCountInput.value);
  }
  resetCount() {
    this.$_setCount(0);
  }
  addCount() {
    this.$_setCount(this.count + 1);
  }
  /**
   * 生成カウンタをセット
   */
  $_setCount(count) {
    this.count = count;
    if (this.countArea) {
      this.countArea.textContent = `${count}`;
    }
  }
}
const SEED_INTERVAL = 1e3;
class D2GFGenerateForever {
  /**
   * コンストラクタ
   * @param {*} type txt2img / img2img
   */
  constructor(type) {
    __publicField(this, "foreverBtn");
    __publicField(this, "cancelBtn");
    __publicField(this, "type");
    __publicField(this, "state");
    __publicField(this, "counter");
    __publicField(this, "generateCount", 0);
    __publicField(this, "pageTitle");
    this.type = type;
    this.state = {
      forever: "stop",
      seed: "random"
    };
    this.generateCount = 0;
    this.counter = new D2GFCounter(type);
    this.pageTitle = document.title;
  }
  /**
   * 初期化
   */
  init() {
    this.createControl();
  }
  /**
   * コントローラー準備
   */
  createControl() {
    const app = gradioApp();
    this.foreverBtn = app.querySelector(`#d2gf-forever-btn_${this.type}`);
    this.foreverBtn.addEventListener("click", () => {
      this.startGenerateForever();
    });
    this.cancelBtn = app.querySelector(`#d2gf-cancel-btn_${this.type}`);
    this.cancelBtn.addEventListener("click", () => {
      this.cancelForever();
    });
    const countContainer = this.counter.createContainer();
    this.counter.resetCount();
    const actionColumn = app.getElementById(`${this.type}_actions_column`);
    const generateBox = app.getElementById(`${this.type}_generate_box`);
    const container = document.createElement("div");
    container.classList.add("d2gf-action-container");
    container.appendChild(this.foreverBtn);
    container.appendChild(this.cancelBtn);
    container.appendChild(countContainer);
    actionColumn.insertBefore(container, generateBox.nextSibling);
    const seedInput = app.querySelector(`#${this.type}_seed input`);
    setInterval(() => {
      this.changeState("seed", seedInput.value !== "-1" ? "fix" : "random");
      this.counter.getBatchCount();
    }, SEED_INTERVAL);
  }
  /**
   * 状態変更
   */
  changeState(stateAttr, state) {
    const foreverBtn = this.foreverBtn;
    const cancelBtn = this.cancelBtn;
    this.state[stateAttr] = state;
    foreverBtn.setAttribute(`data-${stateAttr}`, state);
    cancelBtn.setAttribute(`data-${stateAttr}`, state);
  }
  // webui自体のタイトル変更に影響があるので実装見送り
  // /**
  //  * ページタイトルを変更
  //  */
  // setTitle(count: number = 0, batchCount: string = '') {
  //     if (count) {
  //         document.title = `${this.pageTitle} - [${count} / ${batchCount}]`;
  //     } else {
  //         document.title = this.pageTitle;
  //     }
  // }
  /**
   * 無限生成停止
   */
  cancelForever() {
    this.changeState("forever", "stop");
  }
  /**
   * 無限生成開始
   */
  startGenerateForever() {
    this.counter.resetCount();
    this.changeState("forever", "forever");
    this.generateForever();
  }
  /**
   * 無限生成
   */
  generateForever() {
    const interruptBtn = gradioApp().querySelector(`#${this.type}_interrupt`);
    const generateBtn = gradioApp().querySelector(`#${this.type}_generate`);
    if (interruptBtn.offsetParent === null && this.state.forever === "forever") {
      generateBtn.click();
      this.counter.addCount();
    }
    if (this.counter.getBatchCount() > 1 && this.counter.count >= this.counter.getBatchCount()) {
      this.cancelForever();
    } else if (this.state.forever === "forever") {
      const waitBase = parseInt(opts.d2_gs_wait_base);
      const waitRange = parseInt(opts.d2_gs_wait_range);
      const waitTime = (Math.random() * waitRange + waitBase) * 1e3;
      setTimeout(() => {
        this.generateForever();
      }, waitTime);
    }
  }
}
onUiLoaded(() => {
  const d2gf_t2i = new D2GFGenerateForever("txt2img");
  const d2gf_i2i = new D2GFGenerateForever("img2img");
  d2gf_t2i.init();
  d2gf_i2i.init();
});
//# sourceMappingURL=d2_generate_forever.js.map
