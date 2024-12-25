export async function GET(request: Request) {
	const data = { id: 1, name: 'John Doe' };
	return Response.json({ data });
}
