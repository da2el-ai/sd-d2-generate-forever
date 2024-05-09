from modules import shared

def on_ui_settings():
    section = "d2_generate_forever", "D2 Generate Forever"

    shared.opts.add_option(
        key="d2_gs_wait_base",
        info=shared.OptionInfo(
            3,
            label="生成タイミングの待ち時間（秒 / 初期値 3）",
            section=section,
        ),
    )

    shared.opts.add_option(
        key = "d2_gs_wait_range",
        info = shared.OptionInfo(
            2,
            label = "生成タイミングの振れ幅（秒 / 初期値 2）",
            section = section
        ),
    )
