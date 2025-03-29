# Image Optimization Guidelines for Moodle Cloud

To ensure fast loading times and efficient storage usage in Moodle Cloud, follow these image optimization guidelines:

## Image Format Guidelines

1. **Use WebP format when possible**
   - Convert your PNG/JPG images to WebP for 25-35% smaller file sizes
   - Example command: `cwebp -q 80 input.png -o output.webp`

2. **PNG vs. JPEG**
   - Use PNG for images with text, sharp edges, or transparency
   - Use JPEG for photographs with quality setting 70-80%

## Size Guidelines

1. **Maximum dimensions:**
   - Explanation images: 400-500px width
   - Thumbnail images: 150px width
   - All images should be under 100KB, ideally 50-75KB

2. **Optimize before uploading:**
   - Use tools like TinyPNG, ImageOptim, or Squoosh
   - Remove metadata: `exiftool -all= image.jpg`

## Implementation Guidelines

1. **Always include width/height attributes:**
   ```html
   <img src="image.png" width="400" height="250" alt="Description">
   ```

2. **Use lazy loading:**
   ```html
   <img src="image.png" loading="lazy" alt="Description">
   ```

3. **Responsive images:**
   ```html
   <img srcset="small.jpg 400w, medium.jpg 800w" sizes="(max-width: 600px) 400px, 800px" src="medium.jpg" alt="Description">
   ```

## Tools

- [TinyPNG](https://tinypng.com/) - PNG & JPEG compression
- [Squoosh](https://squoosh.app/) - Image compression with preview
- [Convertio](https://convertio.co/) - Convert to WebP

Following these guidelines will help maintain a balance between image quality and performance.
