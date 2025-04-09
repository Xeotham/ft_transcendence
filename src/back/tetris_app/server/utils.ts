
export const mod = (x: number, n: number): number => {
	if (x < 0)
		return (n - (-x % n)) % n;
	return x % n;
}

