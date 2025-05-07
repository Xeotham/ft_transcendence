
export const mod = (x: number, n: number): number => {
	if (x < 0)
		return (n - (-x % n)) % n;
	return x % n;
}

export const clamp = (value: number, min: number, max: number): number => {
	return Math.max(min, Math.min(value, max));
}

export const delay = async (ms: number) => {
	return new Promise(res => setTimeout(res, ms));
}
