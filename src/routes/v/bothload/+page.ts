export async function load({ data }) {
    console.log('Received data from server:', data); 
    const safeData = data ?? { message: 'aaaa', cool: false }
	const module = safeData.cool
		? await import('./CoolComponent.svelte')
		: await import('./BoringComponent.svelte');

	return {
		component: module.default,
		message: safeData.message
	};
}