
import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blog';
import { useTranslations } from '../hooks/useTranslations';

const BlogPage: React.FC = () => {
    const { t, translate } = useTranslations();

    return (
        <div className="bg-light py-16">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-center text-dark mb-12">
                    {t('blogTitle')}
                </h1>
                <div className="max-w-4xl mx-auto space-y-12">
                    {blogPosts.map(post => (
                        <div key={post.id} className="grid md:grid-cols-3 gap-8 items-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                            <div className="md:col-span-1">
                                <Link to={`/blog/${post.id}`}>
                                    <img src={post.image} alt={translate(post.title)} className="w-full h-auto object-cover rounded-lg" />
                                </Link>
                            </div>
                            <div className="md:col-span-2">
                                <h2 className="text-2xl font-bold text-dark mb-2">
                                    <Link to={`/blog/${post.id}`} className="hover:text-secondary transition-colors">
                                        {translate(post.title)}
                                    </Link>
                                </h2>
                                <p className="text-sm text-gray-500 mb-4">
                                    {t('by')} {post.author} &bull; {new Date(post.date).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600 mb-4">
                                    {translate(post.summary)}
                                </p>
                                <Link to={`/blog/${post.id}`} className="font-semibold text-secondary hover:text-secondary/80 transition-colors">
                                    {t('readMore')} &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
