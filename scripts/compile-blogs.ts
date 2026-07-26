import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOGS_DIR = path.join(process.cwd(), 'content', 'blogs');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'blogs.json');

export function compileBlogs() {
  if (!fs.existsSync(BLOGS_DIR)) {
    fs.mkdirSync(BLOGS_DIR, { recursive: true });
  }

  const files = fs.readdirSync(BLOGS_DIR);
  const posts = files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(BLOGS_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      return {
        slug: data.slug || file.replace(/\.md$/, ''),
        title: data.title || 'Untitled Post',
        description: data.description || '',
        date: data.date ? String(data.date) : new Date().toISOString().split('T')[0],
        readTime: data.readTime || '5 min read',
        tags: data.tags || [],
        featured: Boolean(data.featured),
        author: data.author || {
          name: 'Moliang Zhou',
          role: 'AI Infrastructure & Web3 Engineer',
        },
        content: content.trim(),
      };
    });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2), 'utf8');
  console.log(`[compile-blogs] Successfully compiled ${posts.length} markdown post(s) to ${OUTPUT_FILE}`);
}

compileBlogs();
