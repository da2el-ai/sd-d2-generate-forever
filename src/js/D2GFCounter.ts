/* global gradioApp */
import { TType } from './types';

declare var gradioApp: any;

class D2GFCounter {
    type: TType;
    countArea: HTMLElement | undefined;
    batchArea: HTMLElement | undefined;
    batchCountInput: HTMLInputElement | undefined;
    batchCountText: string = '';
    count = 0;

    /**
     * コンストラクタ
     *
     * @param type txt2img / img2img
     * @param onChangeCount カウンタ更新時に実行する関数
     */
    constructor(type: TType) {
        this.type = type;
    }

    createContainer(): HTMLElement {
        const app = gradioApp();

        const container = document.createElement('span');
        container.id = `d2gf-count-container_${this.type}`;

        this.countArea = document.createElement('span');
        this.countArea.classList.add('d2gf-count-area');

        this.batchArea = document.createElement('span');
        container.appendChild(this.countArea);
        container.appendChild(this.batchArea);

        // バッチカウントエレメント
        this.batchCountInput = app.querySelector(`#${this.type}_batch_count input`) as HTMLInputElement;

        return container;
    }

    /**
     * webui の batch count の値を取得して返す
     * 表示欄も更新する
     * 1だったら∞マークにする
     * @returns
     */
    getBatchCount(): number {
        const batchCountInput = this.batchCountInput as HTMLInputElement;
        if (this.batchArea) {
            this.batchCountText = `${batchCountInput.value === '1' ? '∞' : batchCountInput.value}`;
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
    private $_setCount(count: number) {
        this.count = count;

        if (this.countArea) {
            this.countArea.textContent = `${count}`;
        }
    }
}

export { D2GFCounter };
