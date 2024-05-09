import modules.scripts as scripts
from modules.scripts import AlwaysVisible

from generate_forever.D2GenerateForever import D2GenerateForever


class Script(scripts.Script):
    def title(self):
        return "D2 Generate Forever"

    def show(self, is_img2img):
        return AlwaysVisible

    def ui(self, is_img2img):
        return D2GenerateForever.createUi(is_img2img)

