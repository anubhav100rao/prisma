import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Use in your application
async function reads() {
	// Find unique
	const user = await prisma.user.findUnique({
		where: { email: "alice@example.com" },
	});

	console.log("User found:", user);

	// Find first
	const firstUser = await prisma.user.findFirst({
		where: { name: { contains: "Alice" } },
	});

	// Find many
	const users = await prisma.user.findMany({
		where: {
			posts: {
				some: { published: true },
			},
		},
		include: {
			posts: true,
			profile: true,
		},
		orderBy: { createdAt: "desc" },
		take: 10,
		skip: 20,
	});

	// Count
	const userCount = await prisma.user.count({
		where: { posts: { some: { published: true } } },
	});
}

async function writes() {
	// Create single record
	const user = await prisma.user.create({
		data: {
			email: "alice@example.com",
			name: "Alice Smith",
		},
	});

	// Create with relations
	const userWithPost = await prisma.user.create({
		data: {
			email: "bob@example.com",
			name: "Bob Johnson",
			posts: {
				create: [
					{ title: "My First Post", content: "Hello World!" },
					{ title: "Second Post", content: "Learning Prisma" },
				],
			},
		},
		include: {
			posts: true,
		},
	});

	// Create many
	const users = await prisma.user.createMany({
		data: [
			{ email: "user1@example.com", name: "User 1" },
			{ email: "user2@example.com", name: "User 2" },
		],
	});
}

async function main() {
	reads();
}

main()
	.catch((e) => {
		throw e;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
