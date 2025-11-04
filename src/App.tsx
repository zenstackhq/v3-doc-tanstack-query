import { useClientQueries } from '@zenstackhq/tanstack-query/react';
import { LoremIpsum } from 'lorem-ipsum';
import { schema } from './zenstack/schema-lite';

const lorem = new LoremIpsum({ wordsPerSentence: { min: 3, max: 5 } });

function App() {
    const clientQueries = useClientQueries(schema);
    const { data: users } = clientQueries.user.useFindMany();
    const { data: posts } = clientQueries.post.useFindMany({
        orderBy: { createdAt: 'desc' },
        include: { author: true },
    });
    const createPost = clientQueries.post.useCreate();
    const deletePost = clientQueries.post.useDelete();

    const onCreatePost = () => {
        if (!users) {
            return;
        }

        // random title
        const title = lorem.generateWords();

        // random user as author
        const forUser = users[Math.floor(Math.random() * users.length)];

        console.log(
            'Creating post for user:',
            forUser.id,
            'with title:',
            title
        );
        createPost.mutate({
            data: {
                title,
                authorId: forUser.id,
            },
        });
    };

    const onDeletePost = (postId: string) => {
        deletePost.mutate({
            where: { id: postId },
        });
    };

    return (
        <>
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
                <main className="flex min-h-screen w-full max-w-3xl flex-col items-center p-4 bg-white dark:bg-black sm:items-start">
                    <div className="flex flex-col mt-16 items-center gap-6 text-center sm:items-start sm:text-left">
                        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                            My Awesome Blog
                        </h1>

                        <button
                            onClick={onCreatePost}
                            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
                        >
                            New Post
                        </button>

                        <div>
                            <div>Current users</div>
                            <div className="flex flex-col gap-1 p-2">
                                {users?.map((user) => (
                                    <div
                                        key={user.id}
                                        className="text-sm text-gray-500"
                                    >
                                        {user.email}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col container">
                            {posts?.map((post) => (
                                <div key={post.id} className="py-4">
                                    <div className="flex justify-between">
                                        <div className="flex flex-col text-left">
                                            <h2 className="text-lg font-semibold">
                                                {post.title}
                                            </h2>
                                            <p className="text-xs text-gray-500">by {post.author.name}</p>
                                        </div>
                                        <button
                                            className="ml-4 rounded-md px-2 py-1 text-white cursor-pointer underline text-xs"
                                            onClick={() =>
                                                onDeletePost(post.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default App;
