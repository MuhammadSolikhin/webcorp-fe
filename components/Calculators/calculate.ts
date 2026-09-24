type n = number;

type PMTPayload = { rate: n; nper: n; pv: n; fv: n; type: n };
export function PMT({ pv, fv, rate, nper, type }: PMTPayload): n {
  if (!fv) fv = 0;
  if (!type) type = 0;
  if (rate === 0) return -(pv + fv) / nper;

  const pvif = Math.pow(1 + rate, nper);
  let pmt = (rate / (pvif - 1)) * -(pv * pvif + fv);

  if (type === 1) {
    pmt /= 1 + rate;
  }

  return pmt;
}

type IPMTPlayload = { pv: n; pmt: n; rate: n; per: n };
export function IPMT({ rate, per, pmt, pv }: IPMTPlayload): n {
  const tmp = Math.pow(1 + rate, per);
  return 0 - (pv * tmp * rate + pmt * (tmp - 1));
}

type PPMTPayload = { rate: n; per: n; nper: n; pv: n; fv: n; type: n };
export function PPMT({ per, nper, rate, pv, fv, type }: PPMTPayload) {
  if (per < 1 || per >= nper + 1) return null;
  const pmt = PMT({ fv, nper, pv, rate, type });
  const ipmt = IPMT({ pv, pmt, rate, per: per - 1 });
  return pmt - ipmt;
}
