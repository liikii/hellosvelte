export async function load() {
    console.log("🔵 SERVER LOAD IS RUNNING");
	return {
		message: 'this data came from the server',
		cool: true
	};
}
