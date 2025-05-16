export default {
  // Set the base directory for GitHub pages (update if your repo name is different)
  base: '/EcoCity_A_Green_Urban_WebGame/',

  // Set the project root directory to docs
  root: './docs',

  // Set the directory to serve static files from (relative to the root)
  publicDir: './public', // Only if you have a docs/public folder with extra static assets. If not, you can remove this line.

  // Set the build output directory
  build: {
    outDir: '../dist' // This will put the build output outside docs, which is common
  }
}