# Web shop with React and .NET 
This is a full-stack web application I developed with the purpose of learning React and .NET and expanding my web development skills. 
## Current features
* Responsive design
* Search, filter, and sort products
* Product details page
* Users can like products
* Administrator can add new products and remove or modify existing products
## Technologies used
* **React.js** for front-end
* **TailwindCSS** for styling
* **React Router** for client side routing
* **Axios** as HTTP client
* **.NET 7** for back-end API
* **PostgreSQL** database
* **Entity Framework Core** object-relation mapper
* **JSON Web Tokens** for authentication (as access tokens) along with refresh tokens stored in HttpOnly cookies
* **Docker** for easier running in different environments
## Run with Docker
Run `docker compose up` from the project directory. This will build the front-end React application, build the .NET back-end web API and run it, and start the PostgreSQL database and seed it with sample data. The application will run on port 5000.
## Login credentials
As administrator 
| Username  | Password |
| ----------| ---------|
| admin     | admin    |

As non-admin user 
| Username  | Password |
| ----------| ---------|
| usernameN | password |

N is a number in [0,99] range 
