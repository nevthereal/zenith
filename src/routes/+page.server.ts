import { zEventLLM, zCreateEvent, zEditEvent, zToggleEvent } from '$lib/zod';
import { model } from '$lib/ai';
import { generateObject } from 'ai';
import type { Actions, PageServerLoad } from './$types';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { db } from '$lib/db/db';
import { eventsTable } from '$lib/db/schema';
import { and, asc, eq, lt } from 'drizzle-orm';
import { checkUser } from '$lib/utils';
import { stripe } from '$lib/stripe';
import { PRICE_ID, UPSTASH_TOKEN, UPSTASH_URL } from '$env/static/private';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { building, dev } from '$app/environment';

export const load: PageServerLoad = async ({ locals, depends }) => {
	const user = checkUser(locals);

	const createForm = await superValidate(zod(zCreateEvent));
	const editForm = await superValidate(zod(zEditEvent));
	const toggleForm = await superValidate(zod(zToggleEvent));

	depends('fetch:events');
	const events = db.query.eventsTable.findMany({
		orderBy: asc(eventsTable.date),
		where: and(lt(eventsTable.date, dayjs().endOf('day').toDate()), eq(eventsTable.userId, user.id))
	});

	return { createForm, events, editForm, user, toggleForm };
};

let redis: Redis;
let ratelimit: Ratelimit;

if (!dev && !building) {
	redis = new Redis({
		url: UPSTASH_URL,
		token: UPSTASH_TOKEN
	});

	ratelimit = new Ratelimit({
		redis,
		limiter: Ratelimit.cachedFixedWindow(10, '1h')
	});
}

export const actions: Actions = {
	create: async ({ request, locals, getClientAddress }) => {
		const form = await superValidate(request, zod(zCreateEvent));

		const user = checkUser(locals);
		if (!user.paid) redirect(302, '/account');

		if (!form.valid) {
			return fail(400, { form });
		}

		if (!dev) {
			const ip = getClientAddress();
			const rateLimitAttempt = await ratelimit.limit(ip);

			if (!rateLimitAttempt.success && !user.admin) {
				return fail(429, {
					form
				});
			}
		}

		const { object } = await generateObject({
			model: model,
			schema: zEventLLM,
			mode: 'tool',
			system: `Right now is the ${dayjs().toDate()}. You are an assistant who processes the users input to an event.`,
			prompt: form.data.event
		});

		await db.insert(eventsTable).values({
			content: object.content,
			date: new Date(object.date),
			userId: user.id
		});
		return { form };
	},
	edit: async ({ request, locals }) => {
		const user = checkUser(locals);

		if (!user.paid) redirect(302, '/account');

		const form = await superValidate(request, zod(zEditEvent));

		if (!form.valid) {
			return fail(400, { form });
		}

		await db
			.update(eventsTable)
			.set({
				content: form.data.event,
				date: dayjs(form.data.date).toDate()
			})
			.where(eq(eventsTable.id, form.data.id));
		return { form };
	},
	toggle: async ({ request, locals }) => {
		const user = checkUser(locals);

		const form = await superValidate(request, zod(zToggleEvent));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (form.data.action === 'complete') {
			await db
				.update(eventsTable)
				.set({
					completed: true
				})
				.where(eq(eventsTable.id, form.data.id));
		} else {
			await db
				.delete(eventsTable)
				.where(and(eq(eventsTable.id, form.data.id), eq(eventsTable.userId, user.id)));
		}

		return { form };
	},
	purchase: async ({ locals, url }) => {
		const user = checkUser(locals);

		const session = await stripe.checkout.sessions.create({
			line_items: [{ price: PRICE_ID, quantity: 1 }],
			customer_email: user.email || undefined,
			allow_promotion_codes: true,
			mode: 'payment',
			metadata: {
				userId: user.id
			},
			invoice_creation: {
				enabled: true
			},
			customer_creation: 'always',
			success_url: `${url.origin}/success?id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${url.href}`
		});
		redirect(302, session.url as string);
	}
};
