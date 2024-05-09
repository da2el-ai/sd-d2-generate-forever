declare var onUiLoaded: any;

import { D2GFGenerateForever } from './D2GFGenerateForever';

/////////////////////////////
/////////////////////////////
// UI表示したら作成
onUiLoaded(() => {
    const d2gf_t2i = new D2GFGenerateForever('txt2img');
    const d2gf_i2i = new D2GFGenerateForever('img2img');

    d2gf_t2i.init();
    d2gf_i2i.init();
});
