# Quizzes API

Welcome to the QQuizzes API repository! This API serves as the backend for the Quizzes web application, providing functionalities for managing quizzes, users, authentication, and more.

## Features

-   **Quiz Management**: Create, retrieve, update, and delete quizzes.
-   **User Authentication**: Secure authentication system for managing user accounts.
-   **User Management**: CRUD operations for managing user profiles.
-   **Leaderboard**: Retrieve leaderboard data for quizzes.
-   **API Documentation**: Detailed documentation for API endpoints and usage.

## API Demo
https://api-qquizzes-b24b27944f64.herokuapp.com/api

## Installation

1. Clone the repository to your local machine:

```bash
git clone https://github.com/NhatPhucNguyen/QQuizzes_Backend_Express.git
```

2. Navigate to the project directory:

```bash
cd QQuizzes_Backend_Express
```

3. Install dependencies

```bash
npm install
```

4. Configure environment variables:

-   Create `.env` file by this example:

```env
PORT = 5000 /* your prefer port */
DATABASE_URI = mongodb://127.0.0.1:27017/QQuizzes /* mongodb uri */
ACCESS_TOKEN_SECRET = secret_token_example
REFRESH_TOKEN_SECRET = refresh_token_example
DEV_EXPIRE = 1m /* expiring time for jwt token */
```

-   Update the environment variables with your configuration.

5. Start server in development mode

```build
npm run dev
```

6. The server will be running on the specified port (default 5000)

## API Document

It will be updated soon

## Technologies used

-   **Express.js**: Web application framework for Node.js.
-   **Typescript**: A syntactic superset of JavaScript which adds static typing
-   **MongoDB**: Document-oriented NoSQL database for storing application data.
-   **Mongoose**: MongoDB object modeling tool for Node.js.
-   **JWT**: JSON Web Token for user authentication.
-   **dotenv**: Zero-dependency module for loading environment variables from a .env file.
-   **Jest**: a JavaScript testing framework designed to ensure correctness of any JavaScript codebase
## Contributing
Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue on the GitHub repository. If you'd like to contribute code, feel free to fork the repository and submit a pull request with your changes.

## License
This project is licensed under the MIT License.