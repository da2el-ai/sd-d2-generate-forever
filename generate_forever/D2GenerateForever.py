import gradio as gr
import random
import re

from modules import shared

########################################
########################################
class D2GenerateForever:

    # 再読み込みボタン追加
    @classmethod
    def createUi(cls, is_img2img):
        type = 'img2img' if is_img2img else 'txt2img'

        forever_button = gr.Button(
            value='Forever',
            variant='secondary',
            elem_id='d2gf-forever-btn_' + type,
            size='sm'
        )

        cancel_button = gr.Button(
            value='Cancel',
            variant='secondary',
            elem_id='d2gf-cancel-btn_' + type,
            size='sm'
        )

        return [forever_button, cancel_button]

