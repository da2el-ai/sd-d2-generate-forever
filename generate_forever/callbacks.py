from modules import script_callbacks
from modules.shared import opts


from generate_forever.settings import on_ui_settings

# 設定画面登録
def register_settings():
    script_callbacks.on_ui_settings(on_ui_settings)
