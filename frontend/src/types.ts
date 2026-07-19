export type StarsMeta = {
    count: number
    stride: number
    layout: string[]
}

export type StarDetail = {
    id: number;
    proper: string | null;
    spect: string | null;
    con: string | null;
    mag: number;
    absmag: number;
    dist: number;
    lum: number;
    ci: number | null;
    x: number;
    y: number;
    z: number;
};