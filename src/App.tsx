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
        <main>
            <h1>My Awesome Blog</h1>

            <button
                onClick={onCreatePost}
                className="btn"
            >
                New Post
            </button>

            <div>
                <div>Current users</div>
                <div className="users">
                    {users?.map((user) => (
                        <div
                            key={user.id}
                            className="user"
                        >
                            {user.email}
                        </div>
                    ))}
                </div>
            </div>

            <div className="posts">
                {posts?.map((post) => (
                    <div key={post.id}>
                        <div className="post">
                            <div className="flex flex-col text-left">
                                <h2>{post.title}</h2>
                                <p className="author">by {post.author.name}</p>
                            </div>
                            <button
                                className="btn-link"
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
        </main>
    );
}

export default App;
