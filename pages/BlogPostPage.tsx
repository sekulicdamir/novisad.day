
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../data/blog';
import { useTranslations } from '../hooks/useTranslations';
import NotFoundPage from './NotFoundPage';

const BlogPostPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { translate, t } = useTranslations();
    const post = blogPosts.find(p => p.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!post) {
        return <NotFoundPage />;
    }

    return (
        <div className="bg-light py-16">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto">
                    <article>
                        <header className="mb-8 text-center">
                             <Link to="/blog" className="text-secondary hover:underline mb-4 inline-block">&larr; {t('blogBack')}</Link>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-dark mb-3">{translate(post.title)}</h1>
                            <p className="text-gray-500">
                                {t('by')} {post.author} on {new Date(post.date).toLocaleDateString()}
                            </p>
                        </header>
                        <img src={post.image} alt={translate(post.title)} className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg mb-8" />
                        <div className="prose lg:prose-xl max-w-none mx-auto text-gray-700">
                            <p>{translate(post.content)}</p>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default BlogPostPage;
