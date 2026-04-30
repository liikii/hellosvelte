type Lang = 'en' | 'de' | 'fr';

const greetings: Record<Lang, string> = {
	en: 'en hello!',
	de: 'de hallo!',
	fr: 'fr bonjour!'
};

export function load({ params }) {
	const lang = (params.lang ?? 'en') as Lang;
	return {
		greeting: greetings[lang]
	};
}
