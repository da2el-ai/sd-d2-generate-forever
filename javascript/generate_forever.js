class D2GenerateForever {
  /**
   * コンストラクタ
   * @param {*} area txt2img / img2img
   */
  constructor(area) {
    this.area = area;

    // シード入力欄
    const seedInput = gradioApp()
      .getElementById(`${tab}_seed`)
      .querySelector("input");
  }

  createCountArea() {}
}

/////////////////////////////
/////////////////////////////
// UI表示したら作成
onUiLoaded(() => {
  const d2gf_t2i = new D2GenerateForever("txt2img");
  const d2gf_i2i = new D2GenerateForever("img2img");

  d2gf_t2i.createControl();
  d2gf_i2i.createControl();
});
