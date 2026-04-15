# Technical Documentation 

Here, I documented all my work in this assignment:
* [1. Technologies Used](#1-technologies-used)
* [2. Folder Structure](#2-folder-structure)
* [3. Website Structure](#3-website-structure)
* [4. Image Handling](#4-image-handling)
* [5. JavaScript Functionality](#5-javascript-functionality)
* [6. Accessibility Features](#6-accessibility-features)
* [7. Performance Optimization](#7-performance-optimization)
* [8. Testing and Validation](#8-testing-and-validation)
* [9. GitHub Control](#9-github-control)

Note: the following features are added to what has been built in assignment 1.
1. Dynamic Content: First, greet the user by their name and based on the time of the day. Second, switch between sections using the button on the navigation bar placed at the top of the website.
2. Data Handling:Using localStorage to save user name and their theme preferences.
3. Animation and Transitions: Button hover and shadow effects.
4. Error Handling:Validate user input and send messaeg if the input is empty/invalid.


## 1. Technologies Used

### 1.1 HTML
HTML is used to structure the website content such as sections, headings, paragraphs, images, and form elements. Main elements used:
- sections, headers, paragraphs, links
- images and image containers
- anchor links for navigation

### 1.2 CSS3
CSS is mainly for visualizing the appearance and layout of the website. Main elements used:
- Flexbox for vertical and horizontal alignment
- CSS Grid for project layout
- Box shadows, borders, background, and gradients for design
- Explore color shades
- Use Hover style and position transformation for buttons.
- Apply blur style.
- Disable buttons on the navigation bar before asking the user for their name.
- Use colors in Contact Form to communicate with the user.

### 1.3 JavaScript
JavaScript is used for interactivity and dynamic functionalities. Main elements used:
- Theme switching (light/dark mode)
- Contact form feedback (layout only)
- Use localStorage for saving Theme preferences and saving user name.
- Use Popup page to ask the user for their name and greet them.


## 2. Folder Structure

The project follows a clear and organized folder structure:

```
assignment-1/  
├── assets/images
│ ├── image_placeholder.png
│ ├── project1.png
│ ├── project2.png
│ └── project3.png
├── css/  
│ └── styles.css  
├── docs/  
│ ├── ai-usage-report.md  
│ └── technical-documentation.md  
├── js/  
│ └── script.js  
├── index.html  
├── README.md  
└── .gitignore
```

purpose of each folder:
| File Name | Usage |
|----|----|
| `index.html` | Main page (where the program should run in) |
| `css/styles.css` | For page styling |
| `js/script.js` | For functionality |
| `assets/images/` | Project images |
| `docs/ai-usage-report.md` | A detailed AI usage report |
| `docs/technical-documentation.md` | Technical documentation |


## 3. Portfolio Structure

The website is divided into main sections:

### 3.1 Greeting Feature
- Pop-up page that asks teh user for their name and greet them based on the time of the day

### 3.2 Navigation Bar
- Placed at the top of the page
- Contains links to major sections (About me, Projects, Skills, Contact Form)
- Includes theme toggle button (Dark/light mode)
- Uses anchor links for navigation

### 3.3 About Me Section
- Introduction, personal summary, and quick basic information about my university
- Message button to jump to the contact form section

### 3.4 Projects Section
- Displaying 3 academic projects:
	- Salary Prediction Classification
	- Peruke Game
	- Crime Forecasting in Los Angeles
- Each project card contains:
  - Title
  - Description
  - Image preview

### 3.5 Skills Section
- Organized into 2 categories: Professional and Programming skills
- Using chip-style elements

### 3.6 Contact Section
- Fields used: Name, Email, Message
- 'No backend connection'


## 4. Image Handling

Images are stored in the `assets/images/` directory and are displayed using the relative path:
`<img  src="assets/images/project2.png"  alt="Project description">` 
Each`.img-box` container ensures:
-   Fixed aspect ratio
-   Proper alignment
-   Consistent image sizing
 
 
## 5. JavaScript Functionality

### 5.1 Theme Toggle
-   Switches between light and dark themes
-   Saves preference using `localStorage` 

### 5.2 Contact Form Feedback
-   Prevents default form submission
-   Resets form fields
-   No backend processing
-	Validate user input when empty/incorrect input is submitted.


## 6. Accessibility Features

The website includes basic accessibility features (CSS Style mostly):
-   Alt text for all images
-   Proper form labels
-   High/low contrast in dark/light modes
-   Keyboard-accessible navigation
-	All styles are saved in styles.css and inline-style is avoided.


## 7. Performance Optimization

Several techniques were used to improve the overall performance and layout:
-   Optimized image sizes in each image container    
-   Minimal JavaScript usage (for now)
-   Avoidance of unnecessary animations


## 8. Testing and Validation

The website was tested using:
- Browser Testing
	- Google Chrome
	- Microsoft Edge
- Device Testing
	- Desktop
	- Mobile simulation 
- Functional Testing
	- Navigation links
	- Theme toggle
	- Form submission
	-  Image loading


## 9. GitHub Control

VS Code, Git, and GitHub were used for version control.
- Regular commits
- Descriptive commit messages
- Separate commits for major features
- Online backup through GitHub
 