type TType = 'img2img' | 'txt2img';
type TStateAttr = 'forever' | 'seed';
type TStateVal = 'forever' | 'stop' | 'fix' | 'random';
type TStateDict = { [key in TStateAttr]: TStateVal };

type TOption = {
    d2_gs_wait_base: string;
    d2_gs_wait_range: string;
};

export type { TType, TStateAttr, TStateVal, TStateDict, TOption };
