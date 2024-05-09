/* global gradioApp */
import { D2GFCounter } from './D2GFCounter';
import { TType, TStateAttr, TStateVal, TStateDict, TOption } from './types';

declare var gradioApp: any;
declare var opts: TOption;

const SEED_INTERVAL = 1000;

class D2GFGenerateForever {
    foreverBtn: HTMLButtonElement | undefined;
    cancelBtn: HTMLButtonElement | undefined;

    type: TType;
    state: TStateDict;
    counter: D2GFCounter;
    generateCount = 0;

    /**
     * コンストラクタ
     * @param {*} type txt2img / img2img
     */
    constructor(type: TType) {
        this.type = type;
        this.state = {
            forever: 'stop',
            seed: 'random',
        };
        this.generateCount = 0;
        this.counter = new D2GFCounter(type);
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
        this.foreverBtn = app.querySelector(`#d2gf-forever-btn_${this.type}`) as HTMLButtonElement;
        this.foreverBtn.addEventListener('click', () => {
            this.startGenerateForever();
        });

        this.cancelBtn = app.querySelector(`#d2gf-cancel-btn_${this.type}`) as HTMLButtonElement;
        this.cancelBtn.addEventListener('click', () => {
            this.cancelForever();
        });

        // カウント表示エリア
        const countContainer = this.counter.createContainer();
        this.counter.resetCount();

        // 機能拡張エリアの枠を生成ボタンの下に移動しちゃう
        const actionColumn = app.getElementById(`${this.type}_actions_column`) as HTMLElement;
        const generateBox = app.getElementById(`${this.type}_generate_box`) as HTMLButtonElement;
        const container = document.createElement('div');
        container.classList.add('d2gf-action-container');
        container.appendChild(this.foreverBtn);
        container.appendChild(this.cancelBtn);
        container.appendChild(countContainer);
        actionColumn.insertBefore(container, generateBox.nextSibling);

        // シード入力欄
        const seedInput = app.querySelector(`#${this.type}_seed input`) as HTMLInputElement;

        // シードとバッチカウントを定期的にチェック
        setInterval(() => {
            this.changeState('seed', seedInput.value !== '-1' ? 'fix' : 'random');
            this.counter.getBatchCount();
        }, SEED_INTERVAL);
    }

    /**
     * 状態変更
     */
    changeState(stateAttr: TStateAttr, state: TStateVal) {
        const foreverBtn = this.foreverBtn as HTMLButtonElement;
        const cancelBtn = this.cancelBtn as HTMLButtonElement;

        this.state[stateAttr] = state;
        foreverBtn.setAttribute(`data-${stateAttr}`, state);
        cancelBtn.setAttribute(`data-${stateAttr}`, state);
    }

    /**
     * 無限生成停止
     */
    cancelForever() {
        this.changeState('forever', 'stop');
    }

    /**
     * 無限生成開始
     */
    startGenerateForever() {
        this.counter.resetCount();
        this.changeState('forever', 'forever');
        this.generateForever();
    }

    /**
     * 無限生成
     */
    generateForever() {
        const interruptBtn = gradioApp().querySelector(`#${this.type}_interrupt`) as HTMLButtonElement;
        const generateBtn = gradioApp().querySelector(`#${this.type}_generate`) as HTMLButtonElement;

        // 中止ボタンが非表示の時だけ押せる
        if (interruptBtn.offsetParent === null && this.state.forever === 'forever') {
            generateBtn.click();
            this.counter.addCount();
        }

        if (this.counter.getBatchCount() > 1 && this.counter.count >= this.counter.getBatchCount()) {
            // 指定数に達したら終了
            this.cancelForever();
        } else if (this.state.forever === 'forever') {
            // ランダム時間待機して再実行
            const waitBase = parseInt(opts.d2_gs_wait_base);
            const waitRange = parseInt(opts.d2_gs_wait_range);
            const waitTime = (Math.random() * waitRange + waitBase) * 1000;
            setTimeout(() => {
                this.generateForever();
            }, waitTime);
        }
    }
}

export { D2GFGenerateForever };
