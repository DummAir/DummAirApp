# Blog Management Guide

## How to Add a New Blog Post

Adding a new blog post to DummAir is simple and requires no deep technical skills. Follow these steps:

### Step 1: Open the Blog Posts File

Navigate to `src/lib/blog/posts.ts` in your project.

### Step 2: Add Your New Post

Add a new object to the `blogPosts` array. Here's a template:

```typescript
{
  slug: 'your-post-url-slug',
  title: 'Your Blog Post Title',
  excerpt: 'A short description (150-200 characters) that will appear on the blog index page.',
  featuredImage: 'https://your-image-url.com/image.jpg',
  content: `
    <h1>Your Main Heading</h1>
    <p>Your first paragraph...</p>
    <h2>Subheading</h2>
    <p>More content...</p>
    <img src="https://your-image-url.com/image.jpg" alt="Description">
    <ul>
      <li>List item 1</li>
      <li>List item 2</li>
    </ul>
  `,
  author: 'DummAir Team',
  publishedAt: '2024-12-19', // Format: YYYY-MM-DD
  readingTime: 5, // Optional: estimated reading time in minutes
  category: 'Visa Tips', // Optional: category name
},
```

### Step 3: Important Guidelines

1. **Slug**: Must be URL-friendly (lowercase, use hyphens instead of spaces)
   - ✅ Good: `'how-to-save-money-on-visas'`
   - ❌ Bad: `'How To Save Money On Visas'` or `'how to save money'`

2. **Title**: Keep it engaging and descriptive (50-70 characters for best SEO)

3. **Excerpt**: Should be 150-200 characters, summarizing the post content

4. **Featured Image**: Use a high-quality image URL (recommended: 1200x630px for best display)

5. **Content**: 
   - Can include HTML tags: `<h1>`, `<h2>`, `<p>`, `<ul>`, `<ol>`, `<li>`, `<strong>`, `<em>`, `<img>`, `<blockquote>`
   - Images should include `alt` text for accessibility
   - Use proper heading hierarchy (h1 for main title, h2 for sections, etc.)

6. **Published Date**: Format must be `YYYY-MM-DD`

### Step 4: Save and Deploy

After saving the file:
1. The new post will automatically appear on `/blog` (blog index page)
2. It will be accessible at `/blog/your-post-url-slug`
3. No other changes needed - the system handles routing automatically

## Content Tips

- **Images**: Use external URLs (CDN recommended for fast loading)
- **Length**: Blog posts work well at 800-2000 words
- **Structure**: Use headings to break up content for better readability
- **SEO**: Include relevant keywords naturally in your content
- **Call-to-Action**: Consider adding a link back to the booking page if relevant

## Supported HTML Tags

- Headings: `<h1>`, `<h2>`, `<h3>`
- Text: `<p>`, `<strong>`, `<em>`, `<span>`
- Lists: `<ul>`, `<ol>`, `<li>`
- Images: `<img>` (remember alt text!)
- Blockquotes: `<blockquote>`
- Code: `<code>`, `<pre>`

## Need Help?

If you need assistance adding a blog post or have questions about formatting, contact the development team.

