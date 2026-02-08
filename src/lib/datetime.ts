import dayjsLib from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

const dayjs = dayjsLib;

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export { dayjs };

export function normalizeLocale(locale?: string | null) {
	if (!locale) return undefined;
	try {
		return Intl.getCanonicalLocales(locale)[0];
	} catch {
		return undefined;
	}
}

export function safeTimeZone(timeZone?: string | null) {
	if (!timeZone) return undefined;
	try {
		return Intl.DateTimeFormat('en-US', { timeZone }).resolvedOptions().timeZone;
	} catch {
		return undefined;
	}
}

export function formatDateTime(
	date: Date,
	options?: {
		locale?: string | null;
		timeZone?: string | null;
		dateStyle?: Intl.DateTimeFormatOptions['dateStyle'];
		timeStyle?: Intl.DateTimeFormatOptions['timeStyle'];
	}
) {
	const locale = normalizeLocale(options?.locale) ?? undefined;
	const timeZone = safeTimeZone(options?.timeZone) ?? undefined;
	const dateStyle = options?.dateStyle ?? 'long';
	const timeStyle = options?.timeStyle ?? 'short';

	return new Intl.DateTimeFormat(locale, { dateStyle, timeStyle, timeZone }).format(date);
}

export function formatDate(
	date: Date,
	options?: {
		locale?: string | null;
		timeZone?: string | null;
		dateStyle?: Intl.DateTimeFormatOptions['dateStyle'];
	}
) {
	const locale = normalizeLocale(options?.locale) ?? undefined;
	const timeZone = safeTimeZone(options?.timeZone) ?? undefined;
	const dateStyle = options?.dateStyle ?? 'long';

	return new Intl.DateTimeFormat(locale, { dateStyle, timeZone }).format(date);
}

export function parseUserDateTime(value: string, timeZone: string) {
	const trimmed = value?.trim();
	if (!trimmed) return new Date(NaN);

	const resolvedTimeZone = safeTimeZone(timeZone);
	if (!resolvedTimeZone) return new Date(NaN);

	// If the value already includes a zone/offset, respect it.
	if (/[zZ]$/.test(trimmed) || /[+-]\d{2}:?\d{2}$/.test(trimmed)) {
		return new Date(trimmed);
	}

	const zoned = dayjs.tz(trimmed.replace(' ', 'T'), resolvedTimeZone);
	return zoned.toDate();
}

export function formatDateTimeIso(date: Date, timeZone: string) {
	return dayjs(date).tz(timeZone).format();
}

export function normalizeDateInput(value: string) {
	const trimmed = value?.trim();
	if (!trimmed) return undefined;
	return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : undefined;
}
