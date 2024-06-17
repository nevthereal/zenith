import { redirect } from '@sveltejs/kit';

export const checkUser = (locals: App.Locals) => {
	const user = locals.user;
	if (!user) redirect(302, '/signin');

	return user;
};
