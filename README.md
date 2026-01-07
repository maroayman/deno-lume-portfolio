# Deno Lume Portfolio

A modern, stunning portfolio website built with Deno and Lume static site generator.

## Features

- 🎨 Modern design with glassmorphism effects
- 🌈 Vibrant color palette with gradients
- ✨ Smooth animations and micro-interactions
- 📱 Fully responsive design
- ⚡ Fast performance with static site generation
- 🔍 SEO optimized
- ♿ Accessible

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) installed on your system

### Installation

1. Clone this repository
2. Navigate to the project directory

### Development

Run the development server:

```bash
deno task serve
```

The site will be available at `http://localhost:3000`

### Build

Build the site for production:

```bash
deno task build
```

The built site will be in the `dist` directory.

## Customization

### Update Your Information

1. Edit `src/index.njk` to update:
   - Your name
   - Your title/role
   - About section
   - Skills
   - Projects
   - Contact information

2. Update social media links in `src/_includes/layouts/base.njk`

### Styling

All styles are in `src/styles/main.css`. The design system uses CSS custom properties (variables) for easy customization:

- Colors: Update the `:root` variables for your color scheme
- Typography: Change font families and sizes
- Spacing: Adjust spacing variables
- Effects: Modify glassmorphism and gradient effects

### Adding Pages

Create new `.njk` files in the `src` directory. They will automatically use the base layout.

## Project Structure

```
deno-lume-portfolio/
├── _config.ts              # Lume configuration
├── deno.json               # Deno configuration and tasks
├── src/
│   ├── _includes/
│   │   └── layouts/
│   │       └── base.njk    # Base layout template
│   ├── styles/
│   │   └── main.css        # Main stylesheet
│   ├── index.njk           # Homepage
│   └── 404.njk             # 404 error page
└── dist/                   # Built site (generated)
```

## Technologies Used

- [Deno](https://deno.land/) - Modern JavaScript/TypeScript runtime
- [Lume](https://lume.land/) - Static site generator for Deno
- [Nunjucks](https://mozilla.github.io/nunjucks/) - Templating engine
- CSS3 with modern features (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript for interactions

## License

MIT License - feel free to use this template for your own portfolio!

## Credits

Built with ❤️ using Lume & Deno
